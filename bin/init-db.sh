#!/bin/bash

DB=flash

dropdb $DB
./pg-create.sh $DB $DB $DB

