#!/bin/bash
cd api; npm up; cd ../ui; npm up; npm ci; cd ../test; npm up; cd ../demos; npm up
