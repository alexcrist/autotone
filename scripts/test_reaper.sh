cd build;
rm -rf output;
mkdir output;
./reaper -i ../audio/evil_test_laugh.wav -f output/bla.f0 -a;
echo "File written to output/bla.f0";
less output/bla.f0;
cd ..;