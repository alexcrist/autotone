#include <memory>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string>

#include "core/file_resource.h"
#include "core/track.h"
#include "epoch_tracker/epoch_tracker.h"
#include "wave/wave.h"

extern "C" {

  EpochTracker * et;
  Track * f0_track;
  bool error;
  
  float sample_rate_;
  bool do_highpass_; 
  bool do_hilbert_transform_;

  void init(
    float sample_rate,
    bool do_highpass, 
    bool do_hilbert_transform
  ) {
    et = new EpochTracker();
    sample_rate_ = sample_rate;
    do_highpass_ = do_highpass; 
    do_hilbert_transform_ = do_hilbert_transform;
  }

  void process(
    int16_t * input, 
    int32_t input_length
  ) {
    error = false;

    // Calculate frequencies
    if (!et->Init(
      input,
      input_length,
      sample_rate_,
      kMinF0Search,
      kMaxF0Search,
      do_highpass_,
      do_hilbert_transform_
    )) {
      fprintf(stderr, "Failed to run EpochTracker.Init()\n");
      error = true;
      return;
    }
    if (!et->ComputeFeatures()) {
      fprintf(stderr, "Failed to run EpochTracker.ComputeFeatures()\n");
      error = true;
      return;
    }
    if (!et->TrackEpochs()) {
      fprintf(stderr, "Failed to run EpochTracker.TrackEpochs()\n");
      error = true;
      return;
    }
    std::vector<float> f0;
    std::vector<float> corr;
    if (!et->ResampleAndReturnResults(kExternalFrameInterval, &f0, &corr)) {
      fprintf(stderr, "Failed to run EpochTracker.ResampleAndReturnResults()\n");
      error = true;
      return;
    }

    delete f0_track;
    f0_track = new Track();
    f0_track->resize(f0.size());
    for (int32_t i = 0; i < f0.size(); ++i) {
      float t = kExternalFrameInterval * i;
      f0_track->t(i) = t;
      f0_track->set_v(i, (f0[i] > 0.0) ? true : false);
      f0_track->a(i) = (f0[i] > 0.0) ? f0[i] : -1.0;
    }
  }

  bool get_output_error() {
    return error;
  }

  int32_t get_output_length() {
    return f0_track->num_frames();
  }

  void get_output(float * times, float * freqs) {
    for (int32_t i = 0; i < f0_track->num_frames(); i++) {
      times[i] = f0_track->t(i);
      freqs[i] = f0_track->a(i);
    }
  }

  void cleanup() {
    delete et;
    delete f0_track;
  }
}