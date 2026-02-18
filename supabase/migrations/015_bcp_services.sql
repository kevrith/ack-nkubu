-- ACK BCP – Additional Services: Morning Worship & Swahili Versions
-- =====================================================================

-- =====================================================================
-- MORNING WORSHIP (Service of the Word / Sunday Morning Service)
-- =====================================================================

insert into bcp_sections (slug, title, season, section_type, liturgical_color, order_index, content)
values

('morning-worship', 'Morning Worship (Service of the Word)', null, 'service', null, 5, '[
  {"role":"rubric","text":"THE GATHERING"},
  {"role":"leader","text":"In the name of the Father, and of the Son, and of the Holy Spirit."},
  {"role":"people","text":"Amen."},
  {"role":"leader","text":"Grace, mercy and peace from God our Father and the Lord Jesus Christ be with you."},
  {"role":"people","text":"And also with you."},

  {"role":"rubric","text":"OPENING CANTICLE OR HYMN"},
  {"role":"rubric","text":"The congregation stands to sing a hymn of praise or one of: Venite, Jubilate, or Te Deum."},

  {"role":"rubric","text":"PENITENTIAL RITE"},
  {"role":"leader","text":"Let us confess our sins to God our Father."},
  {"role":"all","text":"Almighty God, our heavenly Father,\nwe have sinned against you\nand against our neighbours,\nin thought and word and deed,\nthrough negligence, through weakness,\nthrough our own deliberate fault.\nWe are heartily sorry\nand repent of all our sins.\nFor the sake of your Son Jesus Christ, who died for us,\nforgive us all that is past\nand grant that we may serve you in newness of life\nto the glory of your name. Amen."},
  {"role":"leader","text":"Almighty God, who forgives all who truly repent, have mercy upon you, pardon and deliver you from all your sins, confirm and strengthen you in all goodness, and keep you in life eternal; through Jesus Christ our Lord."},
  {"role":"people","text":"Amen."},

  {"role":"rubric","text":"KYRIE / GLORIA"},
  {"role":"leader","text":"Lord, have mercy."},
  {"role":"people","text":"Lord, have mercy."},
  {"role":"leader","text":"Christ, have mercy."},
  {"role":"people","text":"Christ, have mercy."},
  {"role":"leader","text":"Lord, have mercy."},
  {"role":"people","text":"Lord, have mercy."},
  {"role":"rubric","text":"During the seasons of Christmas, Epiphany, Easter and Ordinary Time the Gloria may be sung."},

  {"role":"rubric","text":"THE COLLECT OF THE DAY"},
  {"role":"leader","text":"The Lord be with you."},
  {"role":"people","text":"And also with you."},
  {"role":"leader","text":"Let us pray."},
  {"role":"rubric","text":"Silence is kept. Then the Collect for the Sunday or occasion is prayed."},
  {"role":"people","text":"Amen."},

  {"role":"rubric","text":"THE LITURGY OF THE WORD"},
  {"role":"rubric","text":"FIRST READING – Old Testament or Epistle. After the reading:"},
  {"role":"leader","text":"This is the word of the Lord."},
  {"role":"people","text":"Thanks be to God."},
  {"role":"rubric","text":"PSALM – Sung or said responsively."},
  {"role":"rubric","text":"SECOND READING – New Testament Epistle (if three readings are used). After the reading:"},
  {"role":"leader","text":"This is the word of the Lord."},
  {"role":"people","text":"Thanks be to God."},
  {"role":"rubric","text":"GRADUAL HYMN (the congregation stands)"},
  {"role":"rubric","text":"THE GOSPEL – The congregation stands."},
  {"role":"leader","text":"Hear the Gospel of our Lord Jesus Christ according to N."},
  {"role":"people","text":"Glory to you, O Lord."},
  {"role":"rubric","text":"After the Gospel:"},
  {"role":"leader","text":"This is the Gospel of the Lord."},
  {"role":"people","text":"Praise to you, O Christ."},

  {"role":"rubric","text":"THE SERMON"},
  {"role":"rubric","text":"A period of silence may follow the sermon."},

  {"role":"rubric","text":"THE APOSTLES'' CREED (or Nicene Creed)"},
  {"role":"all","text":"I believe in God, the Father almighty,\ncreator of heaven and earth.\n\nI believe in Jesus Christ, his only Son, our Lord,\nwho was conceived by the Holy Spirit,\nborn of the Virgin Mary,\nsuffered under Pontius Pilate,\nwas crucified, died, and was buried;\nhe descended to the dead.\nOn the third day he rose again;\nhe ascended into heaven,\nhe is seated at the right hand of the Father,\nand he will come to judge the living and the dead.\n\nI believe in the Holy Spirit,\nthe holy catholic Church,\nthe communion of saints,\nthe forgiveness of sins,\nthe resurrection of the body,\nand the life everlasting. Amen."},

  {"role":"rubric","text":"PRAYERS OF INTERCESSION"},
  {"role":"rubric","text":"The minister leads prayers for the Church, the world, the local community, those who suffer, and the departed. Each section ends:"},
  {"role":"leader","text":"Lord, in your mercy,"},
  {"role":"people","text":"Hear our prayer."},
  {"role":"rubric","text":"The prayers conclude:"},
  {"role":"leader","text":"Merciful Father,"},
  {"role":"all","text":"Accept these prayers for the sake of your Son, our Saviour Jesus Christ. Amen."},

  {"role":"rubric","text":"THE BLESSING AND DISMISSAL"},
  {"role":"leader","text":"The peace of God, which passes all understanding, keep your hearts and minds in the knowledge and love of God, and of his Son Jesus Christ our Lord; and the blessing of God Almighty, the Father, the Son, and the Holy Spirit, be among you and remain with you always."},
  {"role":"people","text":"Amen."},
  {"role":"leader","text":"Go in peace to love and serve the Lord."},
  {"role":"people","text":"In the name of Christ. Amen."}
]'::jsonb),

-- =====================================================================
-- SWAHILI: IBADA YA ASUBUHI (Morning Worship in Swahili)
-- =====================================================================

('morning-worship-sw', 'Ibada ya Asubuhi (Swahili)', null, 'service', null, 6, '[
  {"role":"rubric","text":"KUKUSANYIKA"},
  {"role":"leader","text":"Kwa jina la Baba, na la Mwana, na la Roho Mtakatifu."},
  {"role":"people","text":"Amen."},
  {"role":"leader","text":"Neema, rehema na amani kutoka kwa Mungu Baba yetu na Bwana Yesu Kristo iwe nanyi."},
  {"role":"people","text":"Na nawe pia."},

  {"role":"rubric","text":"WIMBO WA SIFA AU SANAMU"},
  {"role":"rubric","text":"Mkutano unasimama kuimba wimbo wa sifa au mmoja wa: Venite, Jubilate, au Te Deum."},

  {"role":"rubric","text":"UKIRI WA DHAMBI"},
  {"role":"leader","text":"Tuziungumze dhambi zetu kwa Mungu Baba yetu."},
  {"role":"all","text":"Mungu Mwenyezi, Baba yetu wa mbinguni,\ntumekukosea wewe\nna jirani zetu,\nkwa mawazo na maneno na matendo,\nkwa uzembe wetu, kwa udhaifu wetu,\nkwa makosa yetu wenyewe.\nTuna huzuni ya kweli moyoni\nna tunatubu dhambi zetu zote.\nKwa ajili ya Mwanao Yesu Kristo, aliyekufa kwa ajili yetu,\ntusamehe yote yaliyopita\nna utupe neema ya kukutumikia\nkwa uzima mpya kwa utukufu wa jina lako. Amen."},
  {"role":"leader","text":"Mungu Mwenyezi, anayesamehe wote wanaokutubu kweli, akurehemu, akusamehe na kukuokoa katika dhambi zako zote, akuthibitishe na kukuimarisha katika wema wote, na akushike katika uzima wa milele; kwa njia ya Yesu Kristo Bwana wetu."},
  {"role":"people","text":"Amen."},

  {"role":"rubric","text":"KYRIE"},
  {"role":"leader","text":"Bwana, tuhurumie."},
  {"role":"people","text":"Bwana, tuhurumie."},
  {"role":"leader","text":"Kristo, tuhurumie."},
  {"role":"people","text":"Kristo, tuhurumie."},
  {"role":"leader","text":"Bwana, tuhurumie."},
  {"role":"people","text":"Bwana, tuhurumie."},

  {"role":"rubric","text":"DUA YA SIKU (Collect of the Day)"},
  {"role":"leader","text":"Bwana awe nanyi."},
  {"role":"people","text":"Na pia nawe."},
  {"role":"leader","text":"Tuombe."},
  {"role":"rubric","text":"Kimya kinaangaliwa. Kisha Dua ya Jumapili au tukio husika inasomwa."},
  {"role":"people","text":"Amen."},

  {"role":"rubric","text":"LITURUJIA YA NENO"},
  {"role":"rubric","text":"SOMO LA KWANZA – Agano la Kale au Waraka. Baada ya somo:"},
  {"role":"leader","text":"Hili ni Neno la Bwana."},
  {"role":"people","text":"Asante kwa Mungu."},
  {"role":"rubric","text":"ZABURI – Inasomwa au kuimbwa kwa mwitikio."},
  {"role":"rubric","text":"SOMO LA PILI – Waraka wa Agano Jipya. Baada ya somo:"},
  {"role":"leader","text":"Hili ni Neno la Bwana."},
  {"role":"people","text":"Asante kwa Mungu."},
  {"role":"rubric","text":"WIMBO (mkutano unasimama)"},
  {"role":"rubric","text":"INJILI – Mkutano unasimama."},
  {"role":"leader","text":"Sikia Injili ya Bwana wetu Yesu Kristo kulingana na N."},
  {"role":"people","text":"Utukufu kwako, Ee Bwana."},
  {"role":"rubric","text":"Baada ya Injili:"},
  {"role":"leader","text":"Hii ni Injili ya Bwana."},
  {"role":"people","text":"Sifa kwako, Ee Kristo."},

  {"role":"rubric","text":"MAHUBIRI"},
  {"role":"rubric","text":"Kimya kinaweza kufuata mahubiri."},

  {"role":"rubric","text":"IMANI YA MITUME"},
  {"role":"all","text":"Naamini kwa Mungu, Baba Mwenyezi,\nmuumba wa mbingu na nchi.\n\nNaamini kwa Yesu Kristo, Mwanawe wa pekee, Bwana wetu,\naliyetwaliwa na Roho Mtakatifu,\nalizaliwa na Bikira Maria,\naliteswa chini ya Pontio Pilato,\nalisulubiwa, akafa, akazikwa;\nashuka kuzimu.\nSiku ya tatu akafufuka;\napaa mbinguni,\nkaketi mkono wa kuume wa Mungu Baba Mwenyezi;\nna kutoka huko atakuja kuwahukumu walio hai na wafu.\n\nNaamini kwa Roho Mtakatifu,\nkanisa moja takatifu la ulimwengu,\numoja wa watakatifu,\nmsamaha wa dhambi,\nufufuo wa mwili,\nna uzima wa milele. Amen."},

  {"role":"rubric","text":"SALA ZA UOMBEZI"},
  {"role":"leader","text":"Bwana, kwa rehema yako,"},
  {"role":"people","text":"Sikia sala yetu."},
  {"role":"rubric","text":"Sala zinaisha:"},
  {"role":"leader","text":"Baba mwenye huruma,"},
  {"role":"all","text":"Pokea sala hizi kwa ajili ya Mwanao, Mwokozi wetu Yesu Kristo. Amen."},

  {"role":"rubric","text":"BARAKA NA KUTUMA"},
  {"role":"leader","text":"Amani ya Mungu, ipitayo akili zote, ilinde mioyo yenu na nia zenu katika kumjua na kumpenda Mungu, na Mwanawe Yesu Kristo Bwana wetu; na baraka ya Mungu Mwenyezi, Baba na Mwana na Roho Mtakatifu, iwe juu yenu na ibaki nanyi daima."},
  {"role":"people","text":"Amen."},
  {"role":"leader","text":"Nendeni kwa amani kumtumikia Bwana."},
  {"role":"people","text":"Kwa jina la Kristo. Amen."}
]'::jsonb),

-- =====================================================================
-- SWAHILI: EKARISTI TAKATIFU (Holy Eucharist in Swahili)
-- =====================================================================

('holy-eucharist-sw', 'Ekaristi Takatifu (Swahili)', null, 'service', null, 11, '[
  {"role":"rubric","text":"KUKUSANYIKA"},
  {"role":"leader","text":"Kwa jina la Baba, na la Mwana, na la Roho Mtakatifu."},
  {"role":"people","text":"Amen."},
  {"role":"leader","text":"Bwana awe nanyi."},
  {"role":"people","text":"Na pia nawe."},

  {"role":"rubric","text":"UKIRI WA DHAMBI"},
  {"role":"leader","text":"Tuziungumze dhambi zetu kwa Mungu Baba yetu."},
  {"role":"all","text":"Mungu Mwenyezi, Baba yetu wa mbinguni,\ntumekukosea wewe\nna jirani zetu,\nkwa mawazo na maneno na matendo,\nkwa uzembe wetu, kwa udhaifu wetu,\nkwa makosa yetu wenyewe.\nTuna huzuni ya kweli moyoni\nna tunatubu dhambi zetu zote.\nKwa ajili ya Mwanao Yesu Kristo, aliyekufa kwa ajili yetu,\ntusamehe yote yaliyopita\nna utupe neema ya kukutumikia\nkwa uzima mpya kwa utukufu wa jina lako. Amen."},
  {"role":"leader","text":"Mungu Mwenyezi, anayesamehe wote wanaokutubu kweli, akurehemu, akusamehe na kukuokoa katika dhambi zako zote, akuthibitishe na kukuimarisha katika wema wote, na akushike katika uzima wa milele; kwa njia ya Yesu Kristo Bwana wetu."},
  {"role":"people","text":"Amen."},

  {"role":"rubric","text":"KYRIE"},
  {"role":"leader","text":"Bwana, tuhurumie."},
  {"role":"people","text":"Bwana, tuhurumie."},
  {"role":"leader","text":"Kristo, tuhurumie."},
  {"role":"people","text":"Kristo, tuhurumie."},
  {"role":"leader","text":"Bwana, tuhurumie."},
  {"role":"people","text":"Bwana, tuhurumie."},

  {"role":"rubric","text":"DUA YA SIKU"},
  {"role":"leader","text":"Bwana awe nanyi."},
  {"role":"people","text":"Na pia nawe."},
  {"role":"leader","text":"Tuombe."},
  {"role":"people","text":"Amen."},

  {"role":"rubric","text":"LITURUJIA YA NENO"},
  {"role":"rubric","text":"SOMO LA KWANZA – Baada ya somo:"},
  {"role":"leader","text":"Hili ni Neno la Bwana."},
  {"role":"people","text":"Asante kwa Mungu."},
  {"role":"rubric","text":"ZABURI"},
  {"role":"rubric","text":"SOMO LA PILI – Baada ya somo:"},
  {"role":"leader","text":"Hili ni Neno la Bwana."},
  {"role":"people","text":"Asante kwa Mungu."},
  {"role":"rubric","text":"INJILI – Mkutano unasimama."},
  {"role":"leader","text":"Sikia Injili ya Bwana wetu Yesu Kristo."},
  {"role":"people","text":"Utukufu kwako, Ee Bwana."},
  {"role":"leader","text":"Hii ni Injili ya Bwana."},
  {"role":"people","text":"Sifa kwako, Ee Kristo."},

  {"role":"rubric","text":"MAHUBIRI"},

  {"role":"rubric","text":"IMANI YA NIKEA"},
  {"role":"all","text":"Tunaamini kwa Mungu mmoja, Baba Mwenyezi,\nmuumba wa mbingu na nchi,\nna vitu vyote vinavyoonekana na visivyoonekana.\n\nTunaamini kwa Bwana mmoja Yesu Kristo,\nMwana wa pekee wa Mungu,\nalizaliwa na Baba kabla ya nyakati zote;\nMungu wa Mungu, Nuru ya Nuru,\nMungu wa kweli wa Mungu wa kweli,\nalizaliwa wala hakuumbwa,\nana asili moja na Baba;\nkwa njia yake vitu vyote vilivyoumbwa.\nKwa ajili yetu na wokovu wetu\nshuka kutoka mbinguni:\nkwa nguvu ya Roho Mtakatifu\naliingia mwilini katika Bikira Maria,\nakawa mtu.\nKwa ajili yetu alisulubiwa chini ya Pontio Pilato;\naliteswa na akazikwa.\nSiku ya tatu alifufuka\nkulingana na Maandiko;\napaa mbinguni\nna kukaa mkono wa kuume wa Baba.\nAtakuja tena kwa utukufu kuwahukumu walio hai na wafu,\nna ufalme wake utakuwa bila mwisho.\n\nTunaamini kwa Roho Mtakatifu, Bwana, mtoaji wa uzima,\nanayetoka kwa Baba na Mwana.\nKwa Baba na Mwana anaabudiwa na kutukuzwa.\nAlinena kwa manabii.\nTunaamini kwa kanisa moja takatifu la ulimwengu la kitume.\nTunakiri ubatizo mmoja kwa msamaha wa dhambi.\nTunatazamia ufufuo wa wafu,\nna uzima wa ulimwengu ujao. Amen."},

  {"role":"rubric","text":"SALA ZA UOMBEZI"},
  {"role":"leader","text":"Bwana, kwa rehema yako,"},
  {"role":"people","text":"Sikia sala yetu."},

  {"role":"rubric","text":"LITURUJIA YA SAKRAMENTI"},
  {"role":"leader","text":"Bwana awe nanyi."},
  {"role":"people","text":"Na pia nawe."},
  {"role":"leader","text":"Inueni mioyo yenu."},
  {"role":"people","text":"Tuiinua kwa Bwana."},
  {"role":"leader","text":"Tumshukuru Bwana Mungu wetu."},
  {"role":"people","text":"Ni haki kumshukuru na kumsifu."},

  {"role":"rubric","text":"SANCTUS"},
  {"role":"all","text":"Mtakatifu, Mtakatifu, Mtakatifu ni Bwana,\nMungu wa nguvu zote,\nMbingu na nchi zimejaa utukufu wako.\nHosana juu mbinguni.\nAmebarikiwa anayekuja kwa jina la Bwana.\nHosana juu mbinguni."},

  {"role":"rubric","text":"MANENO YA KUANZISHWA"},
  {"role":"rubric","text":"KUVUNJA MKATE"},
  {"role":"leader","text":"Tunavunja mkate huu kushiriki mwili wa Kristo."},
  {"role":"people","text":"Ingawa tu wengi, tu mwili mmoja, kwa sababu sote tunashiriki mkate mmoja."},

  {"role":"rubric","text":"AGNUS DEI"},
  {"role":"all","text":"Yesu, Mwanakondoo wa Mungu: tuhurumie.\nYesu, mchukuaji wa dhambi zetu: tuhurumie.\nYesu, mwokozi wa ulimwengu: tupe amani yako."},

  {"role":"rubric","text":"USHIRIKA – Wakristo wote waliobatizwa waalikwa kupokea."},

  {"role":"rubric","text":"DUA YA BAADA YA USHIRIKA"},
  {"role":"all","text":"Mungu Mwenyezi, tunakushukuru kwa kutulisha kwa mwili na damu ya Mwanao Yesu Kristo. Kwa njia yake tunakutoa roho zetu na miili yetu kuwa sadaka ya uzima. Tutume kwa nguvu ya Roho wako kuishi na kufanya kazi kwa sifa na utukufu wako. Amen."},

  {"role":"leader","text":"Bwana awe nanyi."},
  {"role":"people","text":"Na pia nawe."},
  {"role":"leader","text":"Nendeni kwa amani kumtumikia Bwana."},
  {"role":"people","text":"Kwa jina la Kristo. Amen."}
]'::jsonb),

-- =====================================================================
-- SWAHILI: SALA YA ASUBUHI (Morning Prayer Daily Office)
-- =====================================================================

('morning-prayer-sw', 'Sala ya Asubuhi (Swahili)', null, 'office', null, 4, '[
  {"role":"rubric","text":"Simama na kusema au kuimba"},
  {"role":"leader","text":"Ee Bwana, ufungue midomo yetu;"},
  {"role":"people","text":"Na midomo yetu itangaze sifa zako."},
  {"role":"leader","text":"Tumwabudu Bwana: Haleluya!"},
  {"role":"people","text":"Asante kwa Mungu: Haleluya!"},
  {"role":"rubric","text":"Wimbo wa Sifa (Venite, Jubilate, au Benedictus) unaimbiwa au kusomwa"},
  {"role":"all","text":"Utukufu kwa Baba, na kwa Mwana, na kwa Roho Mtakatifu:\nkama ulivyokuwa mwanzo, ni hivyo sasa na utakuwa milele. Amen."},
  {"role":"rubric","text":"DUA YA SIKU inasomwa"},
  {"role":"leader","text":"Tuombe."},
  {"role":"rubric","text":"Kimya. Kisha Dua."},
  {"role":"leader","text":"Bwana awe nanyi."},
  {"role":"people","text":"Na pia nawe."},
  {"role":"leader","text":"Tumbariki Bwana."},
  {"role":"people","text":"Asante kwa Mungu."}
]'::jsonb),

-- =====================================================================
-- SWAHILI: SALA YA JIONI (Evening Prayer Daily Office)
-- =====================================================================

('evening-prayer-sw', 'Sala ya Jioni (Swahili)', null, 'office', null, 7, '[
  {"role":"rubric","text":"Simama. Wote waimbe au waseme"},
  {"role":"all","text":"Ee Mungu, fanya haraka kutuokoa;\nEe Bwana, fanya haraka kutusaidia.\nUtukufu kwa Baba, na kwa Mwana, na kwa Roho Mtakatifu:\nkama ulivyokuwa mwanzo, ni hivyo sasa na utakuwa milele. Amen."},
  {"role":"rubric","text":"Wimbo au sanamu inaweza kuimbwa. Kisha Zaburi za siku."},
  {"role":"rubric","text":"Magnificat (Luka 1:46-55) au sanamu nyingine inaimbiwa au kusomwa."},
  {"role":"leader","text":"Bwana awe nanyi."},
  {"role":"people","text":"Na pia nawe."},
  {"role":"leader","text":"Tuombe."},
  {"role":"rubric","text":"Dua ya Siku"},
  {"role":"leader","text":"Tumbariki Bwana."},
  {"role":"people","text":"Asante kwa Mungu."}
]'::jsonb)

on conflict (slug) do update
  set content = excluded.content,
      title = excluded.title,
      order_index = excluded.order_index;

-- =====================================================================
-- SWAHILI CANTICLES
-- =====================================================================

insert into bcp_sections (slug, title, season, section_type, liturgical_color, order_index, content)
values

('canticle-magnificat-sw', 'Magnificat – Wimbo wa Maria (Luka 1:46-55)', null, 'canticle', null, 34, '[
  {"role":"all","text":"Roho yangu inumba utukufu wa Bwana,\nna roho yangu imfurahia Mungu Mwokozi wangu;\nkwa maana alitazama hali ya chini ya mtumishi wake.\nKutoka siku hii vizazi vyote vitaniita mbarikiwa;\nMwenyezi amenifanyia mambo makuu\nna jina lake ni takatifu.\n\nAnawarehemu wanaomcha,\ntoka kizazi hadi kizazi.\nAmeonyesha nguvu kwa mkono wake,\nametawanya wenye kiburi katika mawazo ya mioyo yao,\namewashusha wenye nguvu kutoka viti vya enzi,\nna amewainua wanyenyekevu.\nAmewashibisha wenye njaa kwa mema,\nna kuwapeleka matajiri wakiwa matupu.\n\nAmemkumbuka Israeli mtumishi wake,\nkuhusu ahadi ya rehema,\nahadi aliyowapa mababu zetu,\nIbrahimu na uzao wake milele.\n\nUtukufu kwa Baba, na kwa Mwana, na kwa Roho Mtakatifu;\nkama ulivyokuwa mwanzo, ni hivyo sasa na utakuwa milele. Amen."}
]'::jsonb),

('canticle-benedictus-sw', 'Benedictus – Wimbo wa Zekaria (Luka 1:68-79)', null, 'canticle', null, 33, '[
  {"role":"all","text":"Ahimidiwe Bwana Mungu wa Israeli,\nkwa sababu amewajia na kuwakomboa watu wake.\n\nAmemwinulia nguvu za wokovu,\nkatika nyumba ya Daudi mtumishi wake.\n\nKama vile alivyosema kwa kinywa cha manabii wake watakatifu\nwaliokuwepo tangu zamani:\nkutuokoa na adui zetu,\nnakutoka mikononi mwa wote wanaotuchukia;\nkuwaonyesha huruma mababu zetu,\nnakukumbuka agano lake takatifu.\n\nKiapo alichomwapia Ibrahimu baba yetu,\nkutukomboa na mikononi mwa adui zetu,\nnakumtumikia bila woga,\nkatika utakatifu na haki mbele zake,\nsiku zote za maisha yetu.\n\nNawe, mtoto, utaitwa nabii wa Aliye Juu Sana,\nkwa sababu utakwenda mbele ya Bwana kuiandaa njia yake,\nkuwapa watu wake maarifa ya wokovu\nkwa msamaha wa dhambi zao.\n\nKwa huruma tele za Mungu wetu,\nkupambazuka kutoka juu kutawaangazia,\nkuwaangazia wote waishio gizani na uvulini wa mauti,\nna kuiongoza miguu yetu katika njia ya amani.\n\nUtukufu kwa Baba, na kwa Mwana, na kwa Roho Mtakatifu;\nkama ulivyokuwa mwanzo, ni hivyo sasa na utakuwa milele. Amen."}
]'::jsonb),

('canticle-te-deum-sw', 'Osinkolio Le Kanisa – Te Deum (Swahili)', null, 'canticle', null, 32, '[
  {"role":"all","text":"Tunakusifu, Ee Mungu,\nTunakukiri wewe kuwa Bwana;\nViumbe vyote vya ulimwengu vinakuabudu,\nBaba Mwenyezi wa milele.\n\nMalaika wote, nguvu zote za mbinguni,\nmakerubi na maserafi, wanakusifu kwa wimbo usio na mwisho:\nMtakatifu, Mtakatifu, Mtakatifu ni Bwana wa majeshi,\nMbingu na nchi zimejaa utukufu wako.\n\nUkundi mtukufu wa mitume unakusifu.\nUkundi mtukufu wa manabii unakusifu.\nJeshi jeupe la mashahidi wanakusifu.\nKanisa takatifu la ulimwengu linakukiri:\nBaba, wa ukuu usiokuwa na mipaka,\nMwanao wa kweli na pekee, astahiliye kuabudiwa,\nna Roho Mtakatifu, mwombezi na mwongozaji.\n\nWewe, Kristo, ndiwe Mfalme wa utukufu,\nMwana wa milele wa Baba.\nUlipoumbia binadamu kuwakomboa\nhukudharau tumbo la Bikira.\nUlishinda nguvu ya mauti\nna ukafungua ufalme wa mbinguni kwa waaminifu wote.\nUnaketi mkono wa kuume wa Mungu katika utukufu.\nTunaamini kwamba utakuja na kuwa hakimu wetu.\n\nBasi, Bwana, waokoe watu wako,\nwalioonwa kwa bei ya damu yako mwenyewe,\nnawashirikishe na watakatifu wako\nkwa utukufu wa milele.\n\nOkoa watu wako, Bwana, uibariki urithi wako;\nwatunze sasa na milele.\nKila siku tunakubariki;\ntunalisifu jina lako milele.\nUtunze leo, Bwana, tusije tukatenda dhambi;\nturehemu, Bwana, uturehemu.\nBwana, utuonyeshe upendo na rehema yako,\nkwa sababu tumeweka tumaini letu kwako.\nKwako, Bwana, ndilo tumaini letu;\ntusifadhaishwe milele. Amen."}
]'::jsonb)

on conflict (slug) do update
  set content = excluded.content,
      title = excluded.title;
