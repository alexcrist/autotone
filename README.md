# Autotone

A work-in-proress, open source version of Autotune.

```
- autotune_web        vanilla web app using crepe autotuner keras model + smb_pitch_shifter c project
- scripts             various build scripts
- smb_pitch_shifter   a fast, frequency-domain pitch shifting library
- tuner               a wrapper around the smb_pitch_shifter library
```

## TODOs

* do pitch detection on overlapping buffers (instead of end-to-end)
  * add downsampling algo to tuner_api.c