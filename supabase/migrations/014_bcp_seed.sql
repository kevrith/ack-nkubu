-- ACK Book of Common Prayer – Seed content
-- Content sourced from ACK Kitabu Kipya Cha Ibada (org.worldliturgy.anglicanchurchkenya)
-- =====================================================================
-- HELPER: clean upsert
-- =====================================================================

-- =====================================================================
-- DAILY OFFICES
-- =====================================================================

insert into bcp_sections (slug, title, season, section_type, liturgical_color, order_index, content)
values
('morning-prayer', 'Morning Prayer', null, 'office', null, 1, '[
  {"role":"rubric","text":"Stand and say or sing"},
  {"role":"leader","text":"O Lord, open our lips;"},
  {"role":"people","text":"And our mouths shall proclaim your praise."},
  {"role":"leader","text":"Let us worship the Lord: Alleluia!"},
  {"role":"people","text":"Thanks be to God: Alleluia!"},
  {"role":"rubric","text":"A Canticle of Praise (Venite, Jubilate, or Benedictus) is sung or said"},
  {"role":"all","text":"Glory to the Father, and to the Son, and to the Holy Spirit:\nas it was in the beginning, is now and shall be for ever. Amen."},
  {"role":"rubric","text":"The Collect of the Day is read"},
  {"role":"leader","text":"Let us pray."},
  {"role":"rubric","text":"Silence. Then the Collect."},
  {"role":"leader","text":"The Lord be with you."},
  {"role":"people","text":"And also with you."},
  {"role":"leader","text":"Let us bless the Lord."},
  {"role":"people","text":"Thanks be to God."}
]'::jsonb),

('evening-prayer', 'Evening Prayer', null, 'office', null, 2, '[
  {"role":"rubric","text":"Stand. All sing or say"},
  {"role":"all","text":"O God, make speed to save us;\nO Lord, make haste to help us.\nGlory to the Father, and to the Son, and to the Holy Spirit:\nas it was in the beginning, is now and shall be for ever. Amen."},
  {"role":"rubric","text":"A hymn or canticle may be sung. Then the Psalms for the day."},
  {"role":"rubric","text":"The Magnificat (Luke 1:46-55) or another canticle is sung or said."},
  {"role":"leader","text":"The Lord be with you."},
  {"role":"people","text":"And also with you."},
  {"role":"leader","text":"Let us pray."},
  {"role":"rubric","text":"The Collect of the Day"},
  {"role":"leader","text":"Let us bless the Lord."},
  {"role":"people","text":"Thanks be to God."}
]'::jsonb),

('night-prayer', 'Night Prayer (Compline)', null, 'office', null, 3, '[
  {"role":"leader","text":"The Lord Almighty grant us a quiet night and a perfect end."},
  {"role":"people","text":"Amen."},
  {"role":"leader","text":"Our help is in the name of the Lord;"},
  {"role":"people","text":"Who made heaven and earth."},
  {"role":"rubric","text":"A short lesson is read, then"},
  {"role":"all","text":"Keep watch, dear Lord, with those who work, or watch, or weep this night, and give your angels charge over those who sleep. Tend the sick, Lord Christ; give rest to the weary, bless the dying, soothe the suffering, pity the afflicted, shield the joyous; and all for your love''s sake. Amen."},
  {"role":"all","text":"Guide us waking, O Lord, and guard us sleeping;\nthat awake we may watch with Christ,\nand asleep we may rest in peace."},
  {"role":"rubric","text":"The Nunc Dimittis (Luke 2:29-32) is sung or said"},
  {"role":"leader","text":"The Lord be with you."},
  {"role":"people","text":"And also with you."},
  {"role":"all","text":"The almighty and merciful Lord, Father, Son, and Holy Spirit, bless us and keep us, this night and evermore. Amen."}
]'::jsonb)

on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- =====================================================================
-- HOLY EUCHARIST (Order of Service)
-- =====================================================================

insert into bcp_sections (slug, title, season, section_type, liturgical_color, order_index, content)
values
('holy-eucharist-order', 'Holy Eucharist – Order of Service', null, 'service', null, 10, '[
  {"role":"rubric","text":"THE GATHERING"},
  {"role":"leader","text":"In the name of the Father, and of the Son, and of the Holy Spirit."},
  {"role":"people","text":"Amen."},
  {"role":"leader","text":"The Lord be with you."},
  {"role":"people","text":"And also with you."},
  {"role":"rubric","text":"THE PENITENTIAL RITE – The General Confession"},
  {"role":"all","text":"Almighty God, our heavenly Father,\nwe have sinned against you\nand against our neighbours,\nin thought and word and deed,\nthrough negligence, through weakness,\nthrough our own deliberate fault.\nWe are heartily sorry\nand repent of all our sins.\nFor the sake of your Son Jesus Christ, who died for us,\nforgive us all that is past\nand grant that we may serve you in newness of life\nto the glory of your name. Amen."},
  {"role":"leader","text":"Almighty God, who forgives all who truly repent, have mercy upon you, pardon and deliver you from all your sins, confirm and strengthen you in all goodness, and keep you in life eternal; through Jesus Christ our Lord."},
  {"role":"people","text":"Amen."},
  {"role":"rubric","text":"THE WORD OF GOD"},
  {"role":"rubric","text":"THE CREED"},
  {"role":"all","text":"We believe in one God,\nthe Father, the Almighty,\nmaker of heaven and earth,\nof all that is, seen and unseen.\n\nWe believe in one Lord, Jesus Christ,\nthe only Son of God,\neterally begotten of the Father,\nGod from God, Light from Light,\ntrue God from true God,\nbegotten, not made,\nof one Being with the Father.\nThrough him all things were made.\nFor us and for our salvation\nhe came down from heaven:\nby the power of the Holy Spirit\nhe became incarnate from the Virgin Mary,\nand was made man.\nFor our sake he was crucified under Pontius Pilate;\nhe suffered death and was buried.\nOn the third day he rose again\nin accordance with the Scriptures;\nhe ascended into heaven\nand is seated at the right hand of the Father.\nHe will come again in glory to judge the living and the dead,\nand his kingdom will have no end.\n\nWe believe in the Holy Spirit, the Lord, the giver of life,\nwho proceeds from the Father and the Son.\nWith the Father and the Son he is worshipped and glorified.\nHe has spoken through the Prophets.\nWe believe in one holy catholic and apostolic Church.\nWe acknowledge one baptism for the forgiveness of sins.\nWe look for the resurrection of the dead,\nand the life of the world to come. Amen."},
  {"role":"rubric","text":"THE PRAYERS OF THE PEOPLE"},
  {"role":"rubric","text":"THE LITURGY OF THE SACRAMENT"},
  {"role":"leader","text":"The Lord be with you."},
  {"role":"people","text":"And also with you."},
  {"role":"leader","text":"Lift up your hearts."},
  {"role":"people","text":"We lift them to the Lord."},
  {"role":"leader","text":"Let us give thanks to the Lord our God."},
  {"role":"people","text":"It is right to give thanks and praise."},
  {"role":"rubric","text":"THE SANCTUS"},
  {"role":"all","text":"Holy, holy, holy Lord,\nGod of power and might,\nHeaven and earth are full of your glory.\nHosanna in the highest.\nBlessed is he who comes in the name of the Lord.\nHosanna in the highest."},
  {"role":"rubric","text":"THE WORDS OF INSTITUTION"},
  {"role":"rubric","text":"THE BREAKING OF BREAD"},
  {"role":"leader","text":"We break this bread to share in the body of Christ."},
  {"role":"people","text":"Though we are many, we are one body, because we all share in one bread."},
  {"role":"rubric","text":"THE AGNUS DEI"},
  {"role":"all","text":"Jesus, Lamb of God: have mercy on us.\nJesus, bearer of our sins: have mercy on us.\nJesus, redeemer of the world: give us your peace."},
  {"role":"rubric","text":"THE COMMUNION – All baptised Christians are welcome to receive."},
  {"role":"rubric","text":"POST-COMMUNION PRAYER"},
  {"role":"all","text":"Almighty God, we thank you for feeding us with the body and blood of your Son Jesus Christ. Through him we offer you our souls and bodies to be a living sacrifice. Send us out in the power of your Spirit to live and work to your praise and glory. Amen."},
  {"role":"leader","text":"The Lord be with you."},
  {"role":"people","text":"And also with you."},
  {"role":"leader","text":"Go in peace to love and serve the Lord."},
  {"role":"people","text":"In the name of Christ. Amen."}
]'::jsonb)

on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- =====================================================================
-- CANTICLES
-- =====================================================================

insert into bcp_sections (slug, title, season, section_type, liturgical_color, order_index, content)
values

('canticle-venite', 'Venite – Song of Triumph (Psalm 95)', null, 'canticle', null, 20, '[
  {"role":"all","text":"Come, let us sing to the Lord;\nlet us shout for joy to the Rock of our salvation.\nLet us come before his presence with thanksgiving;\nand raise a loud shout to him with psalms.\n\nFor the Lord is a great God,\nand a great King above all gods.\nIn his hand are the depths of the earth;\nand the heights of the mountains are his also.\nThe sea is his, for he made it,\nand his hands have moulded the dry land.\n\nCome, let us bow down and kneel before the Lord our Maker;\nfor he is our God,\nand we are the people of his pasture and the sheep of his hand.\nOh, that today you would hearken to his voice!\n\nGlory to the Father, and to the Son, and to the Holy Spirit;\nas it was in the beginning, is now and shall be for ever. Amen."}
]'::jsonb),

('canticle-jubilate', 'Jubilate – Song of Joy (Psalm 100)', null, 'canticle', null, 21, '[
  {"role":"all","text":"Be joyful in the Lord, all you lands;\nserve the Lord with gladness\nand come before his presence with a song.\n\nKnow this: the Lord himself is God;\nhe himself has made us, and we are his;\nwe are his people and the sheep of his pasture.\n\nEnter his gates with thanksgiving;\ngo into his courts with praise;\ngive thanks to him and call upon his name.\n\nFor the Lord is good;\nhis mercy is everlasting;\nand his faithfulness endures from age to age.\n\nGlory to the Father, and to the Son, and to the Holy Spirit;\nas it was in the beginning, is now and shall be for ever. Amen."}
]'::jsonb),

('canticle-te-deum', 'Te Deum Laudamus – Song of the Church', null, 'canticle', null, 22, '[
  {"role":"all","text":"We praise you, O God,\nwe acclaim you as Lord;\nall creation worships you,\nthe Father everlasting.\n\nTo you all angels, all the powers of heaven,\nthe cherubim and seraphim, sing in endless praise:\nHoly, holy, holy Lord, God of power and might,\nheaven and earth are full of your glory.\n\nThe glorious company of apostles praises you.\nThe noble fellowship of prophets praises you.\nThe white-robed army of martyrs praises you.\nThroughout the world the holy Church acclaims you:\nFather, of majesty unbounded,\nyour true and only Son, worthy of all worship,\nand the Holy Spirit, advocate and guide.\n\nYou, Christ, are the King of glory,\nthe eternal Son of the Father.\nWhen you became man to set us free\nyou did not disdain the Virgin''s womb.\nYou overcame the sting of death\nand opened the kingdom of heaven to all believers.\nYou are seated at God''s right hand in glory.\nWe believe that you will come and be our judge.\n\nCome then, Lord, and help your people,\nbought with the price of your own blood,\nand bring us with your saints\nto glory everlasting.\n\nSave your people, Lord, and bless your inheritance;\ngovern and uphold them now and always.\nDay by day we bless you;\nwe praise your name for ever.\nKeep us today, Lord, from all sin;\nhave mercy on us, Lord, have mercy.\nLord, show us your love and mercy,\nfor we have put our trust in you.\nIn you, Lord, is our hope;\nlet us never be confounded. Amen."}
]'::jsonb),

('canticle-benedictus', 'Benedictus – Song of Zechariah (Luke 1:68-79)', null, 'canticle', null, 23, '[
  {"role":"all","text":"Blessed be the Lord the God of Israel,\nwho has come to his people and set them free.\n\nHe has raised up for us a mighty Saviour,\nborn of the house of his servant David.\n\nThrough his holy prophets God promised of old\nto save us from our enemies,\nfrom the hands of all who hate us,\nto show mercy to our ancestors,\nand to remember his holy covenant.\n\nThis was the oath God swore to our father Abraham:\nto set us free from the hands of our enemies,\nfree to worship him without fear,\nholy and righteous in his sight\nall the days of our life.\n\nAnd you, child, shall be called the prophet of the Most High,\nfor you will go before the Lord to prepare his way,\nto give his people knowledge of salvation\nby the forgiveness of all their sins.\n\nIn the tender compassion of our God\nthe dawn from on high shall break upon us,\nto shine on those who dwell in darkness and the shadow of death,\nand to guide our feet into the way of peace.\n\nGlory to the Father, and to the Son, and to the Holy Spirit;\nas it was in the beginning, is now and shall be for ever. Amen."}
]'::jsonb),

('canticle-magnificat', 'Magnificat – Song of Mary (Luke 1:46-55)', null, 'canticle', null, 24, '[
  {"role":"all","text":"My soul proclaims the greatness of the Lord,\nmy spirit rejoices in God my Saviour;\nhe has looked with favour on his lowly servant.\nFrom this day all generations will call me blessed;\nthe Almighty has done great things for me\nand holy is his name.\n\nHe has mercy on those who fear him,\nfrom generation to generation.\nHe has shown strength with his arm\nand scattered the proud in their conceit,\ncasting down the mighty from their thrones\nand lifting up the lowly.\nHe has filled the hungry with good things\nand sent the rich away empty.\n\nHe has come to the aid of his servant Israel,\nto remember his promise of mercy,\nthe promise made to our ancestors,\nto Abraham and his children for ever.\n\nGlory to the Father, and to the Son, and to the Holy Spirit;\nas it was in the beginning, is now and shall be for ever. Amen."}
]'::jsonb),

('canticle-nunc-dimittis', 'Nunc Dimittis – Song of Simeon (Luke 2:29-32)', null, 'canticle', null, 25, '[
  {"role":"all","text":"Lord, now lettest thou thy servant depart in peace,\naccording to thy word;\nfor mine eyes have seen thy salvation\nwhich thou hast prepared before the face of all people;\na light to lighten the Gentiles,\nand the glory of thy people Israel.\n\nGlory to the Father, and to the Son, and to the Holy Spirit;\nas it was in the beginning, is now and shall be for ever. Amen."}
]'::jsonb),

('canticle-benedicite', 'Benedicite – A Song of Creation', null, 'canticle', null, 26, '[
  {"role":"all","text":"Bless the Lord, all you works of the Lord:\npraise him and magnify him for ever.\nBless the Lord, you heavens:\npraise him and magnify him for ever.\nBless the Lord, you angels of the Lord:\npraise him and magnify him for ever.\n\nBless the Lord, sun and moon:\npraise him and magnify him for ever.\nBless the Lord, stars of heaven:\npraise him and magnify him for ever.\nBless the Lord, rain and dew:\npraise him and magnify him for ever.\nBless the Lord, all winds:\npraise him and magnify him for ever.\n\nBless the Lord, fire and heat:\npraise him and magnify him for ever.\nBless the Lord, winter and summer:\npraise him and magnify him for ever.\nBless the Lord, dews and frost:\npraise him and magnify him for ever.\nBless the Lord, frost and cold:\npraise him and magnify him for ever.\n\nBless the Lord, all creatures of the Lord:\npraise him and magnify him for ever.\nBless the Lord, O Israel:\npraise him and magnify him for ever.\nBless the Lord, priests of the Lord:\npraise him and magnify him for ever.\nBless the Lord, servants of the Lord:\npraise him and magnify him for ever.\n\nBless the Lord, spirits and souls of the righteous:\npraise him and magnify him for ever.\nBless the Lord, holy and humble in heart:\npraise him and magnify him for ever.\n\nGlory to the Father, and to the Son, and to the Holy Spirit;\nas it was in the beginning, is now and shall be for ever. Amen."}
]'::jsonb)

on conflict (slug) do update set content = excluded.content, title = excluded.title;

-- =====================================================================
-- COLLECTS – ADVENT
-- =====================================================================

insert into bcp_sections (slug, title, season, section_type, liturgical_color, week_number, order_index, content)
values

('collect-advent-sunday', 'The First Sunday of Advent', 'advent', 'collect', 'purple', 1, 100, '[
  {"role":"text","text":"Almighty God, give us grace to cast away the works of darkness and to put on the armour of light, now in the time of this mortal life, in which your Son Jesus Christ came to us in great humility; that on the last day, when he shall come again in his glorious majesty to judge the living and the dead, we may rise to the life immortal; through him who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-advent2', 'The Second Sunday of Advent', 'advent', 'collect', 'purple', 2, 101, '[
  {"role":"text","text":"Blessed Lord, who caused all holy Scriptures to be written for our learning: help us so to hear them, to read, mark, learn and inwardly digest them that, through patience, and the comfort of your holy word, we may embrace and for ever hold fast the hope of everlasting life, which you have given us in our Saviour Jesus Christ, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-advent3', 'The Third Sunday of Advent', 'advent', 'collect', 'rose', 3, 102, '[
  {"role":"text","text":"O Lord Jesus Christ, who at your first coming sent your messenger to prepare your way before you: grant that the ministers and stewards of your mysteries may likewise so prepare and make ready your way by turning the hearts of the disobedient to the wisdom of the just, that at your second coming to judge the world we may be found an acceptable people in your sight; for you are alive and reign with the Father, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-advent4', 'The Fourth Sunday of Advent', 'advent', 'collect', 'purple', 4, 103, '[
  {"role":"text","text":"God our redeemer, who prepared the Blessed Virgin Mary to be the mother of your Son: grant that, as she looked for his coming as our saviour, so we may be ready to greet him when he comes again as our judge; who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

-- CHRISTMAS
('collect-christmas-day', 'Christmas Day', 'christmas', 'collect', 'white', null, 110, '[
  {"role":"text","text":"Almighty God, you make us glad with the yearly remembrance of the birth of your Son Jesus Christ: grant that, as we joyfully receive him as our redeemer, so we may with sure confidence behold him when he shall come to be our judge; who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-christmas1', 'The First Sunday of Christmas', 'christmas', 'collect', 'white', 1, 111, '[
  {"role":"text","text":"Almighty God, who wonderfully created us in your own image and yet more wonderfully restored us through your Son Jesus Christ: grant that, as he came to share in our humanity, so we may share the life of his divinity; who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-epiphany', 'The Epiphany', 'epiphany', 'collect', 'white', null, 120, '[
  {"role":"text","text":"O God, who by the leading of a star manifested your only Son to the peoples of the earth: mercifully grant that we, who know you now by faith, may at last behold your glory face to face; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

-- LENT
('collect-ash-wednesday', 'Ash Wednesday', 'lent', 'collect', 'purple', null, 130, '[
  {"role":"text","text":"Almighty and everlasting God, you hate nothing you have made and forgive the sins of all who are penitent: create and make in us new and contrite hearts that we, worthily lamenting our sins and acknowledging our wretchedness, may receive from you, the God of all mercy, perfect remission and forgiveness; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-lent1', 'The First Sunday of Lent', 'lent', 'collect', 'purple', 1, 131, '[
  {"role":"text","text":"Almighty God, whose Son Jesus Christ fasted forty days in the wilderness, and was tempted as we are, yet without sin: give us grace to discipline ourselves in obedience to your Spirit; and, as you know our weakness, so may we know your power to save; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-lent2', 'The Second Sunday of Lent', 'lent', 'collect', 'purple', 2, 132, '[
  {"role":"text","text":"Almighty God, you show to those who are in error the light of your truth, that they may return to the way of righteousness: grant to all those who are admitted into the fellowship of Christ''s religion, that they may reject those things that are contrary to their profession, and follow all such things as are agreeable to the same; through our Lord Jesus Christ, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-lent3', 'The Third Sunday of Lent', 'lent', 'collect', 'purple', 3, 133, '[
  {"role":"text","text":"Almighty God, whose most dear Son went not up to joy but first he suffered pain, and entered not into glory before he was crucified: mercifully grant that we, walking in the way of the cross, may find it none other than the way of life and peace; through Jesus Christ our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-lent4', 'The Fourth Sunday of Lent', 'lent', 'collect', 'rose', 4, 134, '[
  {"role":"text","text":"Merciful Lord, you know our weakness: grant that those things which we ask faithfully we may obtain effectually; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-lent5', 'The Fifth Sunday of Lent (Passion Sunday)', 'lent', 'collect', 'purple', 5, 135, '[
  {"role":"text","text":"Most merciful God, who by the death and resurrection of your Son Jesus Christ delivered and saved the world: grant that by faith in him who suffered on the cross we may triumph in the power of his victory; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-palm-sunday', 'Palm Sunday', 'lent', 'collect', 'red', 6, 136, '[
  {"role":"text","text":"Almighty and everlasting God, who in your tender love towards the human race sent your Son our Saviour Jesus Christ to take upon him our flesh and to suffer death upon the cross: grant that we may follow the example of his patience and humility, and also be made partakers of his resurrection; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-good-friday', 'Good Friday', 'lent', 'collect', 'red', null, 137, '[
  {"role":"text","text":"Almighty Father, look with mercy on this your family for which our Lord Jesus Christ was content to be betrayed and given up into the hands of sinners and to suffer death upon the cross; who is alive and glorified with you and the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

-- EASTER
('collect-easter-day', 'Easter Day', 'easter', 'collect', 'white', null, 140, '[
  {"role":"text","text":"Lord of all life and power, who through the mighty resurrection of your Son overcame the old order of sin and death to make all things new in him: grant that we, being dead to sin and alive to you in Jesus Christ, may reign with him in glory; to whom with you and the Holy Spirit be praise and honour, glory and might, now and in all eternity. Amen."}
]'::jsonb),

('collect-easter1', 'The First Sunday of Easter', 'easter', 'collect', 'white', 1, 141, '[
  {"role":"text","text":"Almighty Father, you have given your only Son to die for our sins and to rise again for our justification: grant us so to put away the leaven of malice and wickedness that we may always serve you in pureness of living and truth; through the merits of your Son Jesus Christ our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-easter2', 'The Second Sunday of Easter', 'easter', 'collect', 'white', 2, 142, '[
  {"role":"text","text":"Almighty and eternal God, who, for the firmer foundation of our faith, allowed your holy apostle Thomas to doubt the resurrection of your Son until word and sight convinced him: grant to us, who have not seen, that we also may believe and so confess Christ as our Lord and our God; who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-easter3', 'The Third Sunday of Easter', 'easter', 'collect', 'white', 3, 143, '[
  {"role":"text","text":"Almighty Father, who in your great mercy gladdened the disciples with the sight of the risen Lord: give us such knowledge of his presence with us, that we may be strengthened and sustained by his risen life and serve you continually in righteousness and truth; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-easter4', 'The Fourth Sunday of Easter', 'easter', 'collect', 'white', 4, 144, '[
  {"role":"text","text":"Almighty God, whose Son Jesus Christ is the resurrection and the life: raise us, who trust in him, from the death of sin to the life of righteousness, that we may seek those things which are above, where he reigns with you in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-easter5', 'The Fifth Sunday of Easter', 'easter', 'collect', 'white', 5, 145, '[
  {"role":"text","text":"Almighty God, who through your only-begotten Son Jesus Christ have overcome death and opened to us the gate of everlasting life: grant that, as by your grace going before us you put into our minds good desires, so by your continual help we may bring them to good effect; through Jesus Christ our risen Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-ascension', 'Ascension Day', 'easter', 'collect', 'white', null, 147, '[
  {"role":"text","text":"Grant, we pray, almighty God, that as we believe your only-begotten Son our Lord Jesus Christ to have ascended into the heavens, so we in heart and mind may also ascend and with him continually dwell; who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-pentecost', 'The Day of Pentecost', 'easter', 'collect', 'red', null, 148, '[
  {"role":"text","text":"Almighty God, who on the day of Pentecost sent your Holy Spirit to the apostles with the wind from heaven and in tongues of flame, filling them with joy and boldness to preach the gospel: by the power of the same Spirit strengthen us to witness to your truth and to draw everyone to the fire of your love; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity-sunday', 'Trinity Sunday', 'ordinary', 'collect', 'white', null, 149, '[
  {"role":"text","text":"Almighty and everlasting God, you have given us your servants grace, by the confession of a true faith, to acknowledge the glory of the eternal Trinity and in the power of the divine majesty to worship the Unity: keep us steadfast in this faith, that we may evermore be defended from all adversities; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

-- ORDINARY TIME (Sundays after Trinity)
('collect-trinity1', 'The First Sunday after Trinity', 'ordinary', 'collect', 'green', 1, 150, '[
  {"role":"text","text":"God of truth, help us to keep your law of love and to walk in ways of justice and peace; through Jesus Christ our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity2', 'The Second Sunday after Trinity', 'ordinary', 'collect', 'green', 2, 151, '[
  {"role":"text","text":"Lord, you have taught us that all our doings without love are nothing worth: send your Holy Spirit and pour into our hearts that most excellent gift of love, the true bond of peace and of all virtues, without which whoever lives is counted dead before you. Grant this for your only Son Jesus Christ''s sake, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity3', 'The Third Sunday after Trinity', 'ordinary', 'collect', 'green', 3, 152, '[
  {"role":"text","text":"Almighty God, you have broken the tyranny of sin and have sent the Spirit of your Son into our hearts whereby we call you Father: give us grace to dedicate our freedom to your service, that we and all creation may be brought to the glorious liberty of the children of God; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity4', 'The Fourth Sunday after Trinity', 'ordinary', 'collect', 'green', 4, 153, '[
  {"role":"text","text":"O God, the protector of all who trust in you, without whom nothing is strong, nothing is holy: increase and multiply upon us your mercy; that with you as our ruler and guide we may so pass through things temporal that we lose not our hold on things eternal; grant this, heavenly Father, for our Lord Jesus Christ''s sake, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity5', 'The Fifth Sunday after Trinity', 'ordinary', 'collect', 'green', 5, 154, '[
  {"role":"text","text":"Almighty and everlasting God, by whose Spirit the whole body of the Church is governed and sanctified: hear our prayer which we offer for all your faithful people, that in their vocation and ministry they may serve you in holiness and truth to the glory of your name; through our Lord and Saviour Jesus Christ, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity6', 'The Sixth Sunday after Trinity', 'ordinary', 'collect', 'green', 6, 155, '[
  {"role":"text","text":"Merciful God, you have prepared for those who love you such good things as pass our understanding: pour into our hearts such love toward you that we, loving you in all things and above all things, may obtain your promises, which exceed all that we can desire; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity7', 'The Seventh Sunday after Trinity', 'ordinary', 'collect', 'green', 7, 156, '[
  {"role":"text","text":"Lord of all power and might, the author and giver of all good things: graft in our hearts the love of your name; increase in us true religion; nourish us with all goodness; and of your great mercy keep us in the same; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity8', 'The Eighth Sunday after Trinity', 'ordinary', 'collect', 'green', 8, 157, '[
  {"role":"text","text":"Lord God, your Son left the riches of heaven and became poor for our sake: when we prosper save us from pride, when we are needy save us from despair, that we may trust in you alone; through Jesus Christ our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity9', 'The Ninth Sunday after Trinity', 'ordinary', 'collect', 'green', 9, 158, '[
  {"role":"text","text":"Almighty God, who sent your Holy Spirit to be the life and light of your Church: open our hearts to the riches of his grace, that we may bring forth the fruit of the Spirit in love and joy and peace; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity10', 'The Tenth Sunday after Trinity', 'ordinary', 'collect', 'green', 10, 159, '[
  {"role":"text","text":"Let your merciful ears, O Lord, be open to the prayers of your humble servants; and that they may obtain their petitions make them to ask such things as shall please you; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity11', 'The Eleventh Sunday after Trinity', 'ordinary', 'collect', 'green', 11, 160, '[
  {"role":"text","text":"O God, you declare your almighty power most chiefly in showing mercy and pity: mercifully grant to us such a measure of your grace, that we, running the way of your commandments, may receive your gracious promises, and be made partakers of your heavenly treasure; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity12', 'The Twelfth Sunday after Trinity', 'ordinary', 'collect', 'green', 12, 161, '[
  {"role":"text","text":"Almighty and everlasting God, you are always more ready to hear than we to pray and to give more than either we desire or deserve: pour down upon us the abundance of your mercy, forgiving us those things of which our conscience is afraid and giving us those good things which we are not worthy to ask but through the merits and mediation of Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity13', 'The Thirteenth Sunday after Trinity', 'ordinary', 'collect', 'green', 13, 162, '[
  {"role":"text","text":"Almighty God, who called your Church to witness that you were in Christ reconciling the world to yourself: help us so to proclaim the good news of your love, that all who hear it may be drawn to you; through him who was lifted up on the cross, and reigns with you in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity14', 'The Fourteenth Sunday after Trinity', 'ordinary', 'collect', 'green', 14, 163, '[
  {"role":"text","text":"Almighty God, whose only Son has opened for us a new and living way into your presence: give us pure hearts and steadfast wills to worship you in spirit and in truth; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity15', 'The Fifteenth Sunday after Trinity', 'ordinary', 'collect', 'green', 15, 164, '[
  {"role":"text","text":"God, who in generous mercy sent the Holy Spirit upon your Church in the burning fire of your love: grant that your people may be fervent in the fellowship of the gospel that, always abiding in you, they may be found steadfast in faith and active in service; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity16', 'The Sixteenth Sunday after Trinity', 'ordinary', 'collect', 'green', 16, 165, '[
  {"role":"text","text":"O Lord, we beseech you mercifully to hear our prayers, and grant that we, to whom you have given an hearty desire to pray, may by your mighty aid be defended and comforted in all dangers and adversities; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity17', 'The Seventeenth Sunday after Trinity', 'ordinary', 'collect', 'green', 17, 166, '[
  {"role":"text","text":"Lord, we pray that your grace may always precede and follow us, and make us continually to be given to all good works; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity18', 'The Eighteenth Sunday after Trinity', 'ordinary', 'collect', 'green', 18, 167, '[
  {"role":"text","text":"Lord, we beseech you, grant your people grace to withstand the temptations of the world, the flesh, and the devil, and with pure hearts and minds to follow you, the only God; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity19', 'The Nineteenth Sunday after Trinity', 'ordinary', 'collect', 'green', 19, 168, '[
  {"role":"text","text":"O God, forasmuch as without you we are not able to please you; mercifully grant that your Holy Spirit may in all things direct and rule our hearts; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-trinity20', 'The Twentieth Sunday after Trinity', 'ordinary', 'collect', 'green', 20, 169, '[
  {"role":"text","text":"Almighty and most merciful Father, keep us, we pray, from all things that may hurt us, that we, being ready both in body and soul, may cheerfully accomplish those things which you command; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb)

on conflict (slug) do update
  set content = excluded.content,
      title = excluded.title,
      season = excluded.season,
      liturgical_color = excluded.liturgical_color,
      week_number = excluded.week_number;

-- =====================================================================
-- SAINTS' DAYS COLLECTS
-- =====================================================================

insert into bcp_sections (slug, title, season, section_type, liturgical_color, order_index, content)
values

('collect-saint-andrew', 'Saint Andrew the Apostle (30 November)', 'saints', 'collect', 'red', 200, '[
  {"role":"text","text":"Almighty God, who gave such grace to your apostle Saint Andrew that he readily obeyed the call of your Son Jesus Christ and brought his brother with him: call us by your holy word, and give us grace to follow it without delay and to bring those near to us into your gracious presence; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-saint-thomas', 'Saint Thomas the Apostle (21 December)', 'saints', 'collect', 'red', 201, '[
  {"role":"text","text":"Almighty and eternal God, who, for the firmer foundation of our faith, allowed your holy apostle Thomas to doubt the resurrection of your Son until word and sight convinced him: grant to us, who have not seen, that we also may believe and so confess Christ as our Lord and our God; who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-all-saints', 'All Saints'' Day (1 November)', 'saints', 'collect', 'white', 202, '[
  {"role":"text","text":"Almighty God, you have knit together your elect in one communion and fellowship in the mystical body of your Son Christ our Lord: grant us grace so to follow your blessed saints in all virtuous and godly living that we may come to those inexpressible joys that you have prepared for those who truly love you; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-saint-barnabas', 'Saint Barnabas the Apostle (11 June)', 'saints', 'collect', 'red', 203, '[
  {"role":"text","text":"Bountiful God, giver of all gifts, who poured your Spirit upon your servant Barnabas and gave him grace to encourage others: help us, by his example, to be generous in our judgements and unselfish in our service; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-saint-peter', 'Saints Peter and Paul (29 June)', 'saints', 'collect', 'red', 204, '[
  {"role":"text","text":"Almighty God, who inspired your apostle Saint Peter to confess Jesus as Christ and Son of the living God: build up your Church upon this rock, that in unity and peace it may proclaim one truth and follow one Lord, your Son our Saviour Christ, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-saint-luke', 'Saint Luke the Evangelist (18 October)', 'saints', 'collect', 'red', 205, '[
  {"role":"text","text":"Almighty God, you called Luke the physician, whose praise is in the gospel, to be an evangelist and physician of the soul: by the grace of the Spirit and through the wholesome medicine of the gospel, give your Church the same love and power to heal; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-john-baptist', 'The Birth of John the Baptist (24 June)', 'saints', 'collect', 'white', 206, '[
  {"role":"text","text":"Almighty God, by whose providence your servant John the Baptist was wonderfully born, and sent to prepare the way of your Son our Saviour by the preaching of repentance: lead us to repent according to his preaching and, after his example, constantly to speak the truth, boldly to rebuke vice, and patiently to suffer for the truth''s sake; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb),

('collect-blessed-virgin-mary', 'The Blessed Virgin Mary (15 August)', 'saints', 'collect', 'white', 207, '[
  {"role":"text","text":"Almighty God, who looked upon the lowliness of the Blessed Virgin Mary and chose her to be the mother of your only Son: grant that we who are redeemed by his blood may share with her in the glory of your eternal kingdom; through Jesus Christ your Son our Lord, who is alive and reigns with you, in the unity of the Holy Spirit, one God, now and for ever. Amen."}
]'::jsonb)

on conflict (slug) do update
  set content = excluded.content,
      title = excluded.title;

-- =====================================================================
-- LITANIES AND GENERAL PRAYERS
-- =====================================================================

insert into bcp_sections (slug, title, season, section_type, liturgical_color, order_index, content)
values

('lords-prayer', 'The Lord''s Prayer', null, 'litany', null, 300, '[
  {"role":"rubric","text":"As our Saviour Christ has taught us, we are bold to say"},
  {"role":"all","text":"Our Father in heaven,\nhallowed be your name,\nyour kingdom come,\nyour will be done,\non earth as in heaven.\nGive us today our daily bread.\nForgive us our sins\nas we forgive those who sin against us.\nLead us not into temptation\nbut deliver us from evil.\nFor the kingdom, the power,\nand the glory are yours\nnow and for ever. Amen."}
]'::jsonb),

('general-confession', 'The General Confession', null, 'litany', null, 301, '[
  {"role":"rubric","text":"Said together with the minister"},
  {"role":"all","text":"Almighty God, our heavenly Father,\nwe have sinned against you\nand against our neighbours,\nin thought and word and deed,\nthrough negligence, through weakness,\nthrough our own deliberate fault.\nWe are heartily sorry\nand repent of all our sins.\nFor the sake of your Son Jesus Christ, who died for us,\nforgive us all that is past\nand grant that we may serve you in newness of life\nto the glory of your name. Amen."},
  {"role":"rubric","text":"The minister pronounces the Absolution:"},
  {"role":"leader","text":"Almighty God, who forgives all who truly repent, have mercy upon you, pardon and deliver you from all your sins, confirm and strengthen you in all goodness, and keep you in life eternal; through Jesus Christ our Lord."},
  {"role":"people","text":"Amen."}
]'::jsonb),

('apostles-creed', 'The Apostles'' Creed', null, 'litany', null, 302, '[
  {"role":"rubric","text":"Said standing"},
  {"role":"all","text":"I believe in God, the Father almighty,\ncreator of heaven and earth.\n\nI believe in Jesus Christ, his only Son, our Lord,\nwho was conceived by the Holy Spirit,\nborn of the Virgin Mary,\nsuffered under Pontius Pilate,\nwas crucified, died, and was buried;\nhe descended to the dead.\nOn the third day he rose again;\nhe ascended into heaven,\nhe is seated at the right hand of the Father,\nand he will come to judge the living and the dead.\n\nI believe in the Holy Spirit,\nthe holy catholic Church,\nthe communion of saints,\nthe forgiveness of sins,\nthe resurrection of the body,\nand the life everlasting. Amen."}
]'::jsonb),

('kyrie-eleison', 'Kyrie Eleison', null, 'litany', null, 303, '[
  {"role":"leader","text":"Lord, have mercy."},
  {"role":"people","text":"Lord, have mercy."},
  {"role":"leader","text":"Christ, have mercy."},
  {"role":"people","text":"Christ, have mercy."},
  {"role":"leader","text":"Lord, have mercy."},
  {"role":"people","text":"Lord, have mercy."}
]'::jsonb),

('gloria-in-excelsis', 'Gloria in Excelsis', null, 'litany', null, 304, '[
  {"role":"all","text":"Glory to God in the highest,\nand peace to his people on earth.\n\nLord God, heavenly King,\nalmighty God and Father,\nwe worship you, we give you thanks,\nwe praise you for your glory.\n\nLord Jesus Christ, only Son of the Father,\nLord God, Lamb of God,\nyou take away the sin of the world:\nhave mercy on us;\nyou are seated at the right hand of the Father:\nreceive our prayer.\n\nFor you alone are the Holy One,\nyou alone are the Lord,\nyou alone are the Most High,\nJesus Christ,\nwith the Holy Spirit,\nin the glory of God the Father. Amen."}
]'::jsonb)

on conflict (slug) do update
  set content = excluded.content,
      title = excluded.title;
