---
title: Installation
description: How to download and install Tsaraloha Structural Analysis on Windows.
order: 3
status: available
version: 0.1.0
updated: 2026-10-20
keywords: [install, download, setup, windows]
helpIds: []
---
## Official Download

TSA is distributed as a standalone Windows installer on the official
[Download TSA](/downloads/tsa) page.

> [!IMPORTANT]
> Only download TSA from the official Tsaraloha website or certified direct storage. No third-party account or developer toolchain (Visual Studio, CMake) is required.

## Installation Steps

1. Download the official `TSA-0.1.0-windows-x64-setup.exe` package.
2. *(Recommended)* Verify the cryptographic SHA-256 checksum with PowerShell to confirm binary integrity.
3. Launch the installer and follow the Tsaraloha Software setup wizard.
4. Select destination directory (default is `C:\Program Files\Tsaraloha Software\TSA` or local user directory).
5. The wizard associates the `.tsa` file extension and creates Start Menu and Desktop shortcuts.

## After Installation

1. Launch TSA from the Start Menu or Desktop shortcut.
2. Create a new model or open an existing `.tsa` example project.
3. Integrated engineering engines (OpenCASCADE, OpenSees, Gmsh) are ready for immediate use.

## See Also

- [System Requirements](/docs/getting-started/system-requirements)
- [Create a Project](/docs/getting-started/create-project)
