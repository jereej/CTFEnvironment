#!/bin/bash
# Les Baguettes Backup Tool v1.0
# This tool helps backup important files

if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo "Les Baguettes Backup Tool"
    echo "Usage: backup_tool.sh [option]"
    echo ""
    echo "Options:"
    echo "  --help, -h     Show this help message"
    echo "  --read FILE    Read a file (admin use only)"
    echo "  --version      Show version"
    exit 0
fi

if [ "$1" == "--version" ]; then
    echo "Backup Tool v1.0"
    echo "BAGUETTE{suid_binary_exploited}"
    exit 0
fi

if [ "$1" == "--read" ]; then
    if [ -z "$2" ]; then
        echo "Error: Please specify a file to read"
        exit 1
    fi
    # Vulnerability: SUID binary that can read any file
    cat "$2"
    exit 0
fi

echo "Backup Tool: No valid option specified"
echo "Use --help for usage information"
