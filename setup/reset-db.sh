#!/bin/bash
psql -U postgres -c "drop database \"medusa-nuSM\";"
psql -U postgres -c "create database \"medusa-nuSM\";"
psql -U postgres -W -d medusa-nuSM -f medusa-copy.sql
