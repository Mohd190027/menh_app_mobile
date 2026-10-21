#!/bin/bash
mkdir -p /home/z/my-project/scripts/img
cd /home/z/my-project/scripts/img
run(){ z-ai image-search -q "$2" -c 2 --gl us --no-rank -o "$1.json" >/dev/null 2>&1 || echo "FAIL $1"; }
export -f run
cat > /tmp/q.tsv <<'EOF'
secfash	elegant black abaya luxury fashion boutique display
secfood	premium Saudi dates and honey jars traditional luxury
secgift	Arabic luxury home decor candles brass elegant interior
p4a	women cotton embroidered pajama loungewear set folded
p4b	cozy beige cotton pajama set for women
p5	elegant velvet evening gown dress fashion
p8a	natural sidr honey jar with dipper
p8b	glass jar of golden honey wooden table
p9	premium khalas dates in decorative bowl
p10	dark date syrup in glass bottle
p11	dates and honey luxury gift basket
p12	traditional Saudi sadu weaving colorful textile pattern
p13	handwoven colorful textile belt craft closeup
p14	fresh white cheese in bowl homemade
p15	traditional Arabic flat bread tamis fresh baked
p16	scented candle in glass jar with flowers aesthetic
p17	Arabic brass incense burner mabkhara with bakhoor smoke
p18	Arabic coffee cups golden porcelain set dallah
p19a	luxury velvet gift box with ribbon
p19b	elegant white gift box with gold ribbon
p20	Arabic calligraphy framed wall art black and gold
p21	handmade glazed ceramic pottery vase earthy tones
p22	celebration cake with cream frosting decoration
p23	stuffed grape leaves warak enab plate traditional
p24	Arabic hospitality table setting coffee and dates
EOF
cat /tmp/q.tsv | xargs -P 6 -I{} bash -c 'IFS=$'"'"'\t'"'"' read -r k q <<< "{}"; run "$k" "$q"'
echo "=== DONE ==="
ls -la /home/z/my-project/scripts/img/*.json 2>/dev/null | wc -l
