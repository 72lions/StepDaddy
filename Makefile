.PHONY: all setup
.DEFAULT_GOAL = all
ROOT_DIR = $(shell pwd)

all: setup

setup:
	cd $(ROOT_DIR)/server; npm install
