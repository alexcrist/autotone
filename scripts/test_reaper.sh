cd build;
rm -rf output;
mkdir output;
./reaper -i ../audio/evil_test_laugh.wav -f output/bla.f0 -p output/bla.pm -a;
echo "File written to output/bla.f0";
echo "File written to output/bla.pm";
cd ..;