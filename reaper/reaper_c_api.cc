#include <memory>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string>

#include "core/file_resource.h"
#include "core/track.h"
#include "epoch_tracker/epoch_tracker.h"
#include "wave/wave.h"

// https://stackoverflow.com/questions/1615813/how-to-use-c-classes-with-ctypes

extern "C" {

  int helloworld() {
    return 42;
  }
}