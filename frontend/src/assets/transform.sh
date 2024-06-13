#!/bin/bash

convert "$1" "${1%.jpg}.png"

inkscape "${1%.jpg}.png" --export-type=svg --export-filename="${1%.jpg}.svg"

rm "${1%.jpg}.png"

