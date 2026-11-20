# Bonkaroo

Flix'in kırmızı maskotu Flix'in gerçek Flix topunu ayağıyla şutladığı, tek dokunuşluk uzaklık oyunu. Her şut yolculuğu bir önceki şutun bittiği yerden sürdürür: **Türkiye Turu** (İstanbul → Bursa → İzmir → Antalya → Kapadokya → Ankara) ve **Dünya Turu** (İstanbul → Paris → New York → Rio → Kahire → İstanbul). Her şehirde pasaporta damga basılır. 6 dil (TR varsayılan, EN, ES, FR, DE, AR).

## Oynanış
- Flix topu havaya atar; top yeşil halkaya girince dokun. Halkaya yaklaşınca oyun yavaş çekime geçer, mükemmel şutta kısa donma ve parlama olur.
- Havada dokun: zıplama. Kuşlar renkli tüylere bayılır: martı, güvercin, flamingo, papağan, kartal topu kapıp taşır. Teleferik, paraşüt, sıcak hava balonu ve uçak da taşır. Balon patlatınca yükselirsin.
- Şehre özgü etaplar: Marmara'da feribot ve suda sekme, Uludağ'da kar, rampa ve teleferik, İzmir'de flamingo ve zeytinlik, Antalya'da şemsiye ve paraşüt, Kapadokya'da peri bacası ve balon, Ankara'da bozkır ve Atakule.
- Geliştirmeler (altın): Şut Gücü, Lastik Gövde, Renkli Tüyler, Ekstra Zıplama. 10 Flix topu rengi (Kick Up ile aynı renkler).

## Dosyalar
- `index.html`: oyunun tek dosyalık, oynanabilir hali (tarayıcıda açılır). `python3 src/build.py` ile `src/`'den üretilir.
- `src/`: `index.src.html` (arayüz ve stil), `game.js` (oyun, çizimler, mağaza, reklam akışı), `i18n.js` (6 dil), `flix-legal.js` (Yasal Bilgiler / Hakkında, diğer Flix oyunlarıyla ortak), `intro.html` (FLIX TOYS presents açılışı).
- `app/`: Capacitor 8 iOS paketi (`com.flixtoys.bonkaroo`). `ads.js`, `native-bridge.js`, `flix-privacy.js`, `tools/` Flix Jump 1.3.6'dan alındı; oradaki tüm düzeltmeler bu oyunda da var (aşağıda).
- `app/store/`: ikon, açılış ekranı, App Store ekran görüntüleri (6,9", TR + EN), `METADATA.md` (App Store Connect metinleri, IAP listesi, inceleme notları).
- `.github/workflows/ios-testflight.yml`: bulutta derleyip TestFlight'a yükler. `ios-build-check.yml`: her değişiklikte imzasız derleme kontrolü.

## TestFlight'a yükleme
Bir kez, diğer Flix oyunlarındaki aynı değerlerle repo secret'larını gir (Settings > Secrets and variables > Actions ya da terminal):
```bash
R=onatdenizsener/bonkaroo
gh secret set APP_STORE_CONNECT_KEY_ID      -R $R -b "KEY_ID"
gh secret set APP_STORE_CONNECT_ISSUER_ID   -R $R -b "ISSUER_ID"
gh secret set APPLE_TEAM_ID                 -R $R -b "TEAM_ID"
gh secret set APP_STORE_CONNECT_PRIVATE_KEY -R $R < ~/Downloads/AuthKey_KEY_ID.p8
```
Sonra yükle (ikisinden biri):
```bash
gh workflow run ios-testflight.yml -R onatdenizsener/bonkaroo -f version=1.0
git tag v1.0 && git push origin v1.0      # etiket gönderince de aynı iş akışı çalışır
```

## Uygulama içi satın alımlar
`bonk_coins_500`, `bonk_coins_1500`, `bonk_coins_4000`, `bonk_coins_10000` (tüketilebilir), `bonk_noads`, `bonk_skin_pack` (tüketilemez). Ayrıntı ve fiyatlar: `app/store/METADATA.md`.

## Reklamlar
- Ödüllü (isteğe bağlı): şut sonunda **2x Altın** ve **Süper Şut** (sonraki şut %50 güçlü). AdMob reklamı yoksa FLIX TOYS ev reklamı gösterilir ve ödül yine verilir.
- Geçiş: sadece "Devam Et"e basınca, her 3 şutta bir, en fazla 90 sn'de bir, ödüllü reklamdan sonraki 60 sn içinde ve oturumun ilk dakikasında asla. "Reklamsız" kapatır.
- Kimlikler `app/www/ads-config.js` içinde; isteğe bağlı secret'lar `BONKAROO_ADMOB_APP_ID`, `BONKAROO_ADMOB_REWARDED_ID`, `BONKAROO_ADMOB_INTERSTITIAL_ID` dosyadakini ezer.

## Diğer Flix oyunlarından alınan dersler (bu oyunda baştan var)
- Reklam: `addListener` iOS'ta Promise döndürmüyor; yüklenen reklam gösterilemiyordu (Jump #2, Kick Up #6). `ads.js` düzeltilmiş hali.
- Gizlilik: önce Google onay mesajı, sonra Apple takip sorusu, sonra AdMob (Apple 5.1.1(iv) reddi, Jump 1.3.5). Takip sorusu uygulama aktif olunca soruluyor (Kick Up 1.5 reddi, 2.1). AB/UK/CH için Ayarlar'da "Gizlilik Seçenekleri" düğmesi kendiliğinden çıkar.
- Satın alma: ödeme ekranı açılır açılmaz ürün verilmiyor (`realOwned`, sanal işlem sayılmıyor); ürünler mağaza açılmadan da teslim ediliyor (`__flixGrant` + `flush`); geri yükleme ürünleri veriyor; aynı işlem iki kez verilmiyor (`save.tx`); uygulamada sabit TL fiyat yok, fiyat App Store'dan; ödeme ekranını kapatmak hata mesajı göstermez, mağazaya ulaşılamazsa söyler; Ask to Buy "onay bekliyor" der.
- Sadece iPhone (iPad olarak incelenip reddedilme, Kick Up Guideline 4), dikey, şifreleme beyanı, AdMob uygulama kimliği biçim kontrolü (yanlış kimlik açılışta çökertirdi), reklam kontrolü (`ads_audit.py`).

## Lisans
Çizimler, karakterler ve kod Flix'e aittir. © 2026 Kaan İmamoğlu ve Onat Deniz Şener.
