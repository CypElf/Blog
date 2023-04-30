import cv2
import numpy as np
from os import path
from pwn import log

# process the signals at a lower sample rate for faster processing, otherwise it would take too long for it to complete
samp_rate_reduction = 100
samp_rate = 1000000000 / samp_rate_reduction

pixels_per_lines = 768 # 768px
lines_per_frame = 576 # 576i
lines_per_field = lines_per_frame // 2

# see https://en.wikipedia.org/wiki/PAL#PAL_signal_details
# everything is in µs
hsync_pulse = 4.7
back_porch = 5.7
active_video = 51.95
front_porch = 1.65

video_symbol_duration = active_video / pixels_per_lines

def array_bin_to_rgb(array):
    for i in range(len(array)):
        for j in range(len(array[0])):
            if array[i][j] == 1:
                array[i][j] = 255

def reset_field(field):
    for i in range(len(field)):
        for j in range(len(field[0])):
            field[i][j] = 0

def save_frame(frame, frame_number):
    array_bin_to_rgb(frame)
    filename = f"frame_{frame_number}.png"
    log.success(f"Writing to disk frame {frame_number}")
    cv2.imwrite(path.join("frames", filename), np.array(frame))

def fields_to_frame(field_even, field_odd):
    frame = []
    for row_even, row_odd in zip(field_even, field_odd):
        frame.append(row_even)
        frame.append(row_odd)
        
    return frame

def is_match(pattern, duration):
    reference = 0
    tolerated_above = 0
    tolerated_below = 0

    # see https://en.wikipedia.org/wiki/PAL#PAL_signal_details for the tolerated error ranges for each pattern
    if pattern == "front" or pattern == "video":
        tolerated_above = 0.4
        tolerated_below = 0.1
        if pattern == "front":
            reference = front_porch
        if pattern == "video":
            reference = active_video
    else:
        tolerated_above = 0.2
        tolerated_below = 0.2
        if pattern == "back":
            reference = back_porch
        if pattern == "hsync":
            reference = hsync_pulse

    return duration > reference - tolerated_below and duration < reference + tolerated_above

def i_to_us(i):
    return (i / samp_rate) * 1e6

def value_at_time(signal, time):
    # time in µs
    time_in_secs = time * 1e-6
    return signal[int(time_in_secs * samp_rate)]

log.info("Reading video signal...")
video_file = open("video_fixed.txt", "r")
video = video_file.read()[::samp_rate_reduction]
video_file.close()

log.info("Reading sync signal...")
sync_file = open("sync_fixed.txt", "r")
sync = sync_file.read()[::samp_rate_reduction]
sync_file.close()

log.info("Computing the frames...")

field_even = []
field_odd = []

field_line = 0

for i in range(lines_per_field):
    field_even.append([])
    field_odd.append([])
    for _ in range(pixels_per_lines):
        field_even[i].append(0)
        field_odd[i].append(0)

currently_even = True
frames_processed = 0
last_sync_high_time = 0

for i, (video_bit, sync_bit) in enumerate(zip(video, sync)):
    time_us = i_to_us(i)

    if sync_bit == "1":
        duration_since_last_high = time_us - last_sync_high_time
        if is_match("hsync", duration_since_last_high):
            active_video_start = time_us + back_porch
            active_video_end = active_video_start + active_video

            line = []

            # added to avoid reading past the end of the signal and raising an error
            if i + pixels_per_lines >= len(video):
                break

            for j in range(pixels_per_lines):
                # take the value in the middle of the duration for this pixel to be sure to get its value
                pixel_time = active_video_start + (j * video_symbol_duration) + (video_symbol_duration / 2)
                pixel_value = value_at_time(video, pixel_time)

                line.append(pixel_value)

            if "1" in line:
                for j, bit in enumerate(line):
                    if currently_even:
                        field_even[field_line][j] = 0 if bit == "0" else 1
                    else:
                        field_odd[field_line][j] = 0 if bit == "0" else 1

                if field_line == lines_per_field - 1:
                    if not currently_even:
                        # if the field is odd and just finished, we can save the frame because we have both fields set
                        frame = fields_to_frame(field_even, field_odd)
                        save_frame(frame, frames_processed)
                        
                        reset_field(field_even)
                        reset_field(field_odd)
                        currently_even = True
                        frames_processed += 1
                    else:
                        currently_even = False

                    field_line = 0
                else:
                    field_line += 1

    if sync_bit == "1":
        last_sync_high_time = time_us

log.success("Finished processing the video signal")