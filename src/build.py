#!/usr/bin/env python3
"""Builds the playable single-file game (../index.html) from src/: page + FLIX TOYS intro + legal panel + texts + game."""
import os
D = os.path.dirname(os.path.abspath(__file__))
R = lambda p: open(os.path.join(D, p), encoding='utf-8').read()
s = R('index.src.html')
for k, v in [('/*INTRO*/', R('intro.html')), ('/*LEGAL*/', R('flix-legal.js')), ('/*I18N*/', R('i18n.js')), ('/*GAME*/', R('game.js'))]:
    assert s.count(k) == 1, k
    s = s.replace(k, v)
out = os.path.join(D, '..', 'index.html')
open(out, 'w', encoding='utf-8').write(s)
print(os.path.normpath(out), len(s), 'bytes')
