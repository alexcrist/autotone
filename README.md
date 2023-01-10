# Autotone

An open source version of Autotune. Currently, this repo is a collection of scattered but related projects:

```
- audio               directory of test audio clips
- autotone_react      react autotone app using WASM to run reaper + tuner + smb_pitch_shifter C projects
- autotune_web        vanilla web app using crepe autotuner keras model + smb_pitch_shifter c project
- jupyter             jupyter notebook used to prototype reaper / reaper + tuner + smb_pitch_shifter C projects
- reaper              a git submodule with Google's pitch detection repo and a new CMake config to compile for Python usage
- scripts             various build scripts
- smb_pitch_shifter   fast frequency-domain pitch shifting library in C
- tuner               C wrapper which combines reaper pitch detection with pitch shifting for autotoning purposes
```
