-- Seed Golden Bells Hymns
-- Run in Supabase SQL editor after running 032_hymns_category.sql
-- Hymns 21-100 have placeholder lyrics; edit via /admin/hymns

INSERT INTO hymns (number, title, chorus, full_text, is_published, category) VALUES
(1, 'Count Your Blessings', 'Count your blessings, name them one by one,
Count your blessings, see what God hath done!
Count your blessings, name them one by one,
Count your many blessings, see what God hath done.', 'When upon life''s billows you are tempest tossed,
When you are discouraged, thinking all is lost,
Count your many blessings, name them one by one,
And it will surprise you what the Lord hath done.

1. When upon life''s billows you are tempest tossed,
When you are discouraged, thinking all is lost,
Count your many blessings, name them one by one,
And it will surprise you what the Lord hath done.

2. Are you ever burdened with a load of care?
Does the cross seem heavy you are called to bear?
Count your many blessings, every doubt will fly,
And you will keep singing as the days go by.

3. When you look at others with their lands and gold,
Think that Christ has promised you His wealth untold;
Count your many blessings, wealth can never buy
Your reward in heaven, nor your home on high.

4. So, amid the conflict whether great or small,
Do not be discouraged, God is over all;
Count your many blessings, angels will attend,
Help and comfort give you to your journey''s end.', true, 'golden_bells'),
(2, 'When the Roll Is Called Up Yonder', 'When the roll is called up yonder,
When the roll is called up yonder,
When the roll is called up yonder,
When the roll is called up yonder, I''ll be there.', 'When the trumpet of the Lord shall sound, and time shall be no more,
And the morning breaks, eternal, bright and fair;
When the saved of earth shall gather over on the other shore,
And the roll is called up yonder, I''ll be there.

1. When the trumpet of the Lord shall sound, and time shall be no more,
And the morning breaks, eternal, bright and fair;
When the saved of earth shall gather over on the other shore,
And the roll is called up yonder, I''ll be there.

2. On that bright and cloudless morning when the dead in Christ shall rise,
And the glory of His resurrection share;
When His chosen ones shall gather to their home beyond the skies,
And the roll is called up yonder, I''ll be there.

3. Let us labor for the Master from the dawn till setting sun,
Let us talk of all His wondrous love and care;
Then when all of life is over, and our work on earth is done,
And the roll is called up yonder, I''ll be there.', true, 'golden_bells'),
(3, 'I Have Decided to Follow Jesus', NULL, 'I have decided to follow Jesus,
I have decided to follow Jesus,
I have decided to follow Jesus,
No turning back, no turning back.

1. I have decided to follow Jesus,
I have decided to follow Jesus,
I have decided to follow Jesus,
No turning back, no turning back.

2. Though none go with me, I still will follow,
Though none go with me, I still will follow,
Though none go with me, I still will follow,
No turning back, no turning back.

3. The world behind me, the cross before me,
The world behind me, the cross before me,
The world behind me, the cross before me,
No turning back, no turning back.

4. Will you decide now to follow Jesus?
Will you decide now to follow Jesus?
Will you decide now to follow Jesus?
No turning back, no turning back.', true, 'golden_bells'),
(4, 'Trust and Obey', 'Trust and obey, for there''s no other way
To be happy in Jesus, but to trust and obey.', 'When we walk with the Lord in the light of His Word,
What a glory He sheds on our way!
While we do His good will, He abides with us still,
And with all who will trust and obey.

1. When we walk with the Lord in the light of His Word,
What a glory He sheds on our way!
While we do His good will, He abides with us still,
And with all who will trust and obey.

2. Not a burden we bear, not a sorrow we share,
But our toil He doth richly repay;
Not a grief or a loss, not a frown or a cross,
But is blest if we trust and obey.

3. But we never can prove the delights of His love
Until all on the altar we lay;
For the favor He shows, for the joy He bestows,
Are for them who will trust and obey.

4. Then in fellowship sweet we will sit at His feet,
Or we''ll walk by His side in the way;
What He says we will do, where He sends we will go;
Never fear, only trust and obey.', true, 'golden_bells'),
(5, 'Just As I Am', NULL, 'Just as I am, without one plea,
But that Thy blood was shed for me,
And that Thou bidst me come to Thee,
O Lamb of God, I come, I come.

1. Just as I am, without one plea,
But that Thy blood was shed for me,
And that Thou bidst me come to Thee,
O Lamb of God, I come, I come.

2. Just as I am, and waiting not
To rid my soul of one dark blot,
To Thee whose blood can cleanse each spot,
O Lamb of God, I come, I come.

3. Just as I am, though tossed about
With many a conflict, many a doubt,
Fightings and fears within, without,
O Lamb of God, I come, I come.

4. Just as I am, poor, wretched, blind;
Sight, riches, healing of the mind,
Yea, all I need in Thee to find,
O Lamb of God, I come, I come.

5. Just as I am, Thou wilt receive,
Wilt welcome, pardon, cleanse, relieve;
Because Thy promise I believe,
O Lamb of God, I come, I come.

6. Just as I am, Thy love unknown
Hath broken every barrier down;
Now, to be Thine, yea, Thine alone,
O Lamb of God, I come, I come.', true, 'golden_bells'),
(6, 'Pass Me Not O Gentle Saviour', 'Saviour, Saviour,
Hear my humble cry;
While on others Thou art calling,
Do not pass me by.', 'Pass me not, O gentle Saviour,
Hear my humble cry;
While on others Thou art calling,
Do not pass me by.

1. Pass me not, O gentle Saviour,
Hear my humble cry;
While on others Thou art calling,
Do not pass me by.

2. Let me at Thy throne of mercy
Find a sweet relief,
Kneeling there in deep contrition;
Help my unbelief.

3. Trusting only in Thy merit,
Would I seek Thy face;
Heal my wounded, broken spirit,
Save me by Thy grace.

4. Thou the Spring of all my comfort,
More than life to me,
Whom have I on earth beside Thee?
Whom in heav''n but Thee?', true, 'golden_bells'),
(7, 'The Old Rugged Cross', 'So I''ll cherish the old rugged cross,
Till my trophies at last I lay down;
I will cling to the old rugged cross,
And exchange it some day for a crown.', 'On a hill far away stood an old rugged cross,
The emblem of suffering and shame;
And I love that old cross where the dearest and best
For a world of lost sinners was slain.

1. On a hill far away stood an old rugged cross,
The emblem of suffering and shame;
And I love that old cross where the dearest and best
For a world of lost sinners was slain.

2. O that old rugged cross, so despised by the world,
Has a wondrous attraction for me;
For the dear Lamb of God left His glory above
To bear it to dark Calvary.

3. In that old rugged cross, stained with blood so divine,
A wondrous beauty I see,
For ''twas on that old cross Jesus suffered and died,
To pardon and sanctify me.

4. To the old rugged cross I will ever be true;
Its shame and reproach gladly bear;
Then He''ll call me some day to my home far away,
Where His glory forever I''ll share.', true, 'golden_bells'),
(8, 'Softly and Tenderly', 'Come home, come home,
Ye who are weary, come home;
Earnestly, tenderly, Jesus is calling,
Calling, O sinner, come home!', 'Softly and tenderly Jesus is calling,
Calling for you and for me;
See, on the portals He''s waiting and watching,
Watching for you and for me.

1. Softly and tenderly Jesus is calling,
Calling for you and for me;
See, on the portals He''s waiting and watching,
Watching for you and for me.

2. Why should we tarry when Jesus is pleading,
Pleading for you and for me?
Why should we linger and heed not His mercies,
Mercies for you and for me?

3. Time is now fleeting, the moments are passing,
Passing from you and from me;
Shadows are gathering, deathbeds are coming,
Coming for you and for me.

4. O for the wonderful love He has promised,
Promised for you and for me!
Though we have sinned, He has mercy and pardon,
Pardon for you and for me.', true, 'golden_bells'),
(9, 'Sweet Hour of Prayer', NULL, 'Sweet hour of prayer! sweet hour of prayer!
That calls me from a world of care,
And bids me at my Father''s throne
Make all my wants and wishes known.
In seasons of distress and grief,
My soul has often found relief,
And oft escaped the tempter''s snare,
By thy return, sweet hour of prayer!

1. Sweet hour of prayer! sweet hour of prayer!
That calls me from a world of care,
And bids me at my Father''s throne
Make all my wants and wishes known.
In seasons of distress and grief,
My soul has often found relief,
And oft escaped the tempter''s snare,
By thy return, sweet hour of prayer!

2. Sweet hour of prayer! sweet hour of prayer!
The joys I feel, the bliss I share,
Of those whose anxious spirits burn
With strong desires for thy return!
With such I hasten to the place
Where God my Saviour shows His face,
And gladly take my station there,
And wait for thee, sweet hour of prayer!

3. Sweet hour of prayer! sweet hour of prayer!
Thy wings shall my petition bear
To Him whose truth and faithfulness
Engage the waiting soul to bless.
And since He bids me seek His face,
Believe His Word and trust His grace,
I''ll cast on Him my every care,
And wait for thee, sweet hour of prayer!', true, 'golden_bells'),
(10, 'Onward Christian Soldiers', 'Onward, Christian soldiers, marching as to war,
With the cross of Jesus going on before.', 'Onward, Christian soldiers, marching as to war,
With the cross of Jesus going on before.
Christ, the royal Master, leads against the foe;
Forward into battle see His banners go!

1. Onward, Christian soldiers, marching as to war,
With the cross of Jesus going on before.
Christ, the royal Master, leads against the foe;
Forward into battle see His banners go!

2. At the sign of triumph Satan''s host doth flee;
On then, Christian soldiers, on to victory!
Hell''s foundations quiver at the shout of praise;
Brothers, lift your voices, loud your anthems raise.

3. Like a mighty army moves the church of God;
Brothers, we are treading where the saints have trod.
We are not divided, all one body we,
One in hope and doctrine, one in charity.

4. Crowns and thrones may perish, kingdoms rise and wane,
But the church of Jesus constant will remain.
Gates of hell can never ''gainst that church prevail;
We have Christ''s own promise, and that cannot fail.

5. Onward then, ye people, join our happy throng,
Blend with ours your voices in the triumph song.
Glory, laud, and honor unto Christ the King,
This through countless ages men and angels sing.', true, 'golden_bells'),
(11, 'My Hope Is Built on Nothing Less', 'On Christ, the solid Rock, I stand;
All other ground is sinking sand,
All other ground is sinking sand.', 'My hope is built on nothing less
Than Jesus'' blood and righteousness;
I dare not trust the sweetest frame,
But wholly lean on Jesus'' name.

1. My hope is built on nothing less
Than Jesus'' blood and righteousness;
I dare not trust the sweetest frame,
But wholly lean on Jesus'' name.

2. When darkness veils His lovely face,
I rest on His unchanging grace;
In every high and stormy gale,
My anchor holds within the veil.

3. His oath, His covenant, His blood,
Support me in the whelming flood;
When all around my soul gives way,
He then is all my hope and stay.

4. When He shall come with trumpet sound,
O, may I then in Him be found;
Dressed in His righteousness alone,
Faultless to stand before the throne.', true, 'golden_bells'),
(12, 'In the Garden', 'And He walks with me, and He talks with me,
And He tells me I am His own;
And the joy we share as we tarry there,
None other has ever known.', 'I come to the garden alone,
While the dew is still on the roses,
And the voice I hear falling on my ear
The Son of God discloses.

1. I come to the garden alone,
While the dew is still on the roses,
And the voice I hear falling on my ear
The Son of God discloses.

2. He speaks, and the sound of His voice,
Is so sweet the birds hush their singing,
And the melody that He gave to me
Within my heart is ringing.

3. I''d stay in the garden with Him,
Though the night around me be falling,
But He bids me go; through the voice of woe
His voice to me is calling.', true, 'golden_bells'),
(13, 'Stand Up Stand Up for Jesus', NULL, 'Stand up, stand up for Jesus, ye soldiers of the cross;
Lift high His royal banner, it must not suffer loss.
From victory unto victory His army shall He lead,
Till every foe is vanquished, and Christ is Lord indeed.

1. Stand up, stand up for Jesus, ye soldiers of the cross;
Lift high His royal banner, it must not suffer loss.
From victory unto victory His army shall He lead,
Till every foe is vanquished, and Christ is Lord indeed.

2. Stand up, stand up for Jesus, the trumpet call obey;
Forth to the mighty conflict, in this His glorious day.
Ye that are brave now serve Him against unnumbered foes;
Let courage rise with danger, and strength to strength oppose.

3. Stand up, stand up for Jesus, stand in His strength alone;
The arm of flesh will fail you, ye dare not trust your own.
Put on the gospel armor, each piece put on with prayer;
Where duty calls or danger, be never wanting there.

4. Stand up, stand up for Jesus, the strife will not be long;
This day the noise of battle, the next the victor''s song.
To those who vanquish evil a crown of life shall be;
They with the King of Glory shall reign eternally.', true, 'golden_bells'),
(14, 'He Lives', 'He lives, He lives, Christ Jesus lives today!
He walks with me and talks with me along life''s narrow way.
He lives, He lives, salvation to impart!
You ask me how I know He lives? He lives within my heart.', 'I serve a risen Saviour, He''s in the world today;
I know that He is living, whatever men may say;
I see His hand of mercy, I hear His voice of cheer,
And just the time I need Him, He''s always near.

1. I serve a risen Saviour, He''s in the world today;
I know that He is living, whatever men may say;
I see His hand of mercy, I hear His voice of cheer,
And just the time I need Him, He''s always near.

2. In all the world around me I see His loving care,
And though my heart grows weary I never will despair;
I know that He is leading through all the stormy blast,
The day of His appearing will come at last.

3. Rejoice, rejoice, O Christian, lift up your voice and sing
Eternal hallelujahs to Jesus Christ the King!
The hope of all who seek Him, the help of all who find,
None other is so loving, so good and kind.', true, 'golden_bells'),
(15, 'Near to the Heart of God', 'O Jesus, blest Redeemer,
Sent from the heart of God,
Hold us who wait before Thee
Near to the heart of God.', 'There is a place of quiet rest,
Near to the heart of God,
A place where sin cannot molest,
Near to the heart of God.

1. There is a place of quiet rest,
Near to the heart of God,
A place where sin cannot molest,
Near to the heart of God.

2. There is a place of comfort sweet,
Near to the heart of God,
A place where we our Saviour meet,
Near to the heart of God.

3. There is a place of full release,
Near to the heart of God,
A place where all is joy and peace,
Near to the heart of God.', true, 'golden_bells'),
(16, 'Leaning on the Everlasting Arms', 'Leaning, leaning,
Safe and secure from all alarms;
Leaning, leaning,
Leaning on the everlasting arms.', 'What a fellowship, what a joy divine,
Leaning on the everlasting arms;
What a blessedness, what a peace is mine,
Leaning on the everlasting arms.

1. What a fellowship, what a joy divine,
Leaning on the everlasting arms;
What a blessedness, what a peace is mine,
Leaning on the everlasting arms.

2. O how sweet to walk in this pilgrim way,
Leaning on the everlasting arms;
O how bright the path grows from day to day,
Leaning on the everlasting arms.

3. What have I to dread, what have I to fear,
Leaning on the everlasting arms?
I have blessed peace with my Lord so near,
Leaning on the everlasting arms.', true, 'golden_bells'),
(17, 'Bringing In the Sheaves', 'Bringing in the sheaves, bringing in the sheaves,
We shall come rejoicing, bringing in the sheaves;
Bringing in the sheaves, bringing in the sheaves,
We shall come rejoicing, bringing in the sheaves.', 'Sowing in the morning, sowing seeds of kindness,
Sowing in the noontide and the dewy eve;
Waiting for the harvest, and the time of reaping,
We shall come rejoicing, bringing in the sheaves.

1. Sowing in the morning, sowing seeds of kindness,
Sowing in the noontide and the dewy eve;
Waiting for the harvest, and the time of reaping,
We shall come rejoicing, bringing in the sheaves.

2. Sowing in the sunshine, sowing in the shadows,
Fearing neither clouds nor winter''s chilling breeze;
By and by the harvest, and the labor ended,
We shall come rejoicing, bringing in the sheaves.

3. Going forth with weeping, sowing for the Master,
Though the loss sustained our spirit often grieves;
When our weeping''s over, He will bid us welcome,
We shall come rejoicing, bringing in the sheaves.', true, 'golden_bells'),
(18, 'At the Cross', 'At the cross, at the cross where I first saw the light,
And the burden of my heart rolled away,
It was there by faith I received my sight,
And now I am happy all the day!', 'Alas! and did my Saviour bleed,
And did my Sovereign die?
Would He devote that sacred head
For sinners such as I?

1. Alas! and did my Saviour bleed,
And did my Sovereign die?
Would He devote that sacred head
For sinners such as I?

2. Was it for crimes that I have done
He groaned upon the tree?
Amazing pity! grace unknown!
And love beyond degree!

3. Well might the sun in darkness hide,
And shut his glories in,
When Christ, the mighty Maker, died
For man the creature''s sin.

4. Thus might I hide my blushing face
While His dear cross appears,
Dissolve my heart in thankfulness,
And melt my eyes to tears.

5. But drops of grief can ne''er repay
The debt of love I owe:
Here, Lord, I give myself away,
''Tis all that I can do.', true, 'golden_bells'),
(19, 'Take My Life and Let It Be', NULL, 'Take my life, and let it be
Consecrated, Lord, to Thee;
Take my moments and my days;
Let them flow in ceaseless praise,
Let them flow in ceaseless praise.

1. Take my life, and let it be
Consecrated, Lord, to Thee;
Take my moments and my days;
Let them flow in ceaseless praise,
Let them flow in ceaseless praise.

2. Take my hands, and let them move
At the impulse of Thy love;
Take my feet and let them be
Swift and beautiful for Thee,
Swift and beautiful for Thee.

3. Take my voice, and let me sing
Always, only, for my King;
Take my lips, and let them be
Filled with messages from Thee,
Filled with messages from Thee.

4. Take my silver and my gold;
Not a mite would I withhold;
Take my intellect, and use
Every power as Thou shalt choose,
Every power as Thou shalt choose.

5. Take my will, and make it Thine;
It shall be no longer mine.
Take my heart, it is Thine own;
It shall be Thy royal throne,
It shall be Thy royal throne.

6. Take my love, my Lord, I pour
At Thy feet its treasure-store;
Take myself, and I will be
Ever, only, all for Thee,
Ever, only, all for Thee.', true, 'golden_bells'),
(20, 'Jesus Loves Me', 'Yes, Jesus loves me!
Yes, Jesus loves me!
Yes, Jesus loves me!
The Bible tells me so.', 'Jesus loves me! This I know,
For the Bible tells me so.
Little ones to Him belong;
They are weak, but He is strong.

1. Jesus loves me! This I know,
For the Bible tells me so.
Little ones to Him belong;
They are weak, but He is strong.

2. Jesus loves me! He who died
Heaven''s gate to open wide;
He will wash away my sin,
Let His little child come in.

3. Jesus loves me! He will stay
Close beside me all the way;
Thou hast bled and died for me,
I will henceforth live for Thee.

4. Jesus loves me! He will stay
Close beside me all the way;
If I love Him, when I die
He will take me home on high.', true, 'golden_bells'),
(21, 'To God Be the Glory', NULL, 'Lyrics for To God Be the Glory — add via Admin panel', true, 'golden_bells'),
(22, 'Rescue the Perishing', NULL, 'Lyrics for Rescue the Perishing — add via Admin panel', true, 'golden_bells'),
(23, 'I Surrender All', NULL, 'Lyrics for I Surrender All — add via Admin panel', true, 'golden_bells'),
(24, 'Blessed Be the Name', NULL, 'Lyrics for Blessed Be the Name — add via Admin panel', true, 'golden_bells'),
(25, 'More Love to Thee', NULL, 'Lyrics for More Love to Thee — add via Admin panel', true, 'golden_bells'),
(26, 'Higher Ground', NULL, 'Lyrics for Higher Ground — add via Admin panel', true, 'golden_bells'),
(27, 'The Solid Rock', NULL, 'Lyrics for The Solid Rock — add via Admin panel', true, 'golden_bells'),
(28, 'There Is Power in the Blood', NULL, 'Lyrics for There Is Power in the Blood — add via Admin panel', true, 'golden_bells'),
(29, 'Nothing But the Blood', NULL, 'Lyrics for Nothing But the Blood — add via Admin panel', true, 'golden_bells'),
(30, 'Are You Washed in the Blood', NULL, 'Lyrics for Are You Washed in the Blood — add via Admin panel', true, 'golden_bells'),
(31, 'Jesus Paid It All', NULL, 'Lyrics for Jesus Paid It All — add via Admin panel', true, 'golden_bells'),
(32, 'Calvary Covers It All', NULL, 'Lyrics for Calvary Covers It All — add via Admin panel', true, 'golden_bells'),
(33, 'Burdens Are Lifted at Calvary', NULL, 'Lyrics for Burdens Are Lifted at Calvary — add via Admin panel', true, 'golden_bells'),
(34, 'Since Jesus Came Into My Heart', NULL, 'Lyrics for Since Jesus Came Into My Heart — add via Admin panel', true, 'golden_bells'),
(35, 'Saved Saved', NULL, 'Lyrics for Saved Saved — add via Admin panel', true, 'golden_bells'),
(36, 'Victory in Jesus', NULL, 'Lyrics for Victory in Jesus — add via Admin panel', true, 'golden_bells'),
(37, 'I Know Whom I Have Believed', NULL, 'Lyrics for I Know Whom I Have Believed — add via Admin panel', true, 'golden_bells'),
(38, 'Safe in the Arms of Jesus', NULL, 'Lyrics for Safe in the Arms of Jesus — add via Admin panel', true, 'golden_bells'),
(39, 'Face to Face with Christ My Saviour', NULL, 'Lyrics for Face to Face with Christ My Saviour — add via Admin panel', true, 'golden_bells'),
(40, 'When We All Get to Heaven', NULL, 'Lyrics for When We All Get to Heaven — add via Admin panel', true, 'golden_bells'),
(41, 'In the Sweet By and By', NULL, 'Lyrics for In the Sweet By and By — add via Admin panel', true, 'golden_bells'),
(42, 'Shall We Gather at the River', NULL, 'Lyrics for Shall We Gather at the River — add via Admin panel', true, 'golden_bells'),
(43, 'Beautiful River', NULL, 'Lyrics for Beautiful River — add via Admin panel', true, 'golden_bells'),
(44, 'Take the Name of Jesus with You', NULL, 'Lyrics for Take the Name of Jesus with You — add via Admin panel', true, 'golden_bells'),
(45, 'Jesus Is the Sweetest Name I Know', NULL, 'Lyrics for Jesus Is the Sweetest Name I Know — add via Admin panel', true, 'golden_bells'),
(46, 'His Name Is Wonderful', NULL, 'Lyrics for His Name Is Wonderful — add via Admin panel', true, 'golden_bells'),
(47, 'All Hail the Power of Jesus Name', NULL, 'Lyrics for All Hail the Power of Jesus Name — add via Admin panel', true, 'golden_bells'),
(48, 'Jesus Is Lord', NULL, 'Lyrics for Jesus Is Lord — add via Admin panel', true, 'golden_bells'),
(49, 'Crown Him Lord of All', NULL, 'Lyrics for Crown Him Lord of All — add via Admin panel', true, 'golden_bells'),
(50, 'A Mighty Fortress Is Our God', NULL, 'Lyrics for A Mighty Fortress Is Our God — add via Admin panel', true, 'golden_bells'),
(51, 'Faith of Our Fathers', NULL, 'Lyrics for Faith of Our Fathers — add via Admin panel', true, 'golden_bells'),
(52, 'Tell Me the Story of Jesus', NULL, 'Lyrics for Tell Me the Story of Jesus — add via Admin panel', true, 'golden_bells'),
(53, 'Fairest Lord Jesus', NULL, 'Lyrics for Fairest Lord Jesus — add via Admin panel', true, 'golden_bells'),
(54, 'Beautiful Saviour', NULL, 'Lyrics for Beautiful Saviour — add via Admin panel', true, 'golden_bells'),
(55, 'How Sweet the Name of Jesus Sounds', NULL, 'Lyrics for How Sweet the Name of Jesus Sounds — add via Admin panel', true, 'golden_bells'),
(56, 'Jesus the Very Thought of Thee', NULL, 'Lyrics for Jesus the Very Thought of Thee — add via Admin panel', true, 'golden_bells'),
(57, 'Thou Art Worthy', NULL, 'Lyrics for Thou Art Worthy — add via Admin panel', true, 'golden_bells'),
(58, 'Praise to the Lord the Almighty', NULL, 'Lyrics for Praise to the Lord the Almighty — add via Admin panel', true, 'golden_bells'),
(59, 'Praise Him Praise Him', NULL, 'Lyrics for Praise Him Praise Him — add via Admin panel', true, 'golden_bells'),
(60, 'To Him Who Sits on the Throne', NULL, 'Lyrics for To Him Who Sits on the Throne — add via Admin panel', true, 'golden_bells'),
(61, 'Lift Every Voice and Sing', NULL, 'Lyrics for Lift Every Voice and Sing — add via Admin panel', true, 'golden_bells'),
(62, 'We Gather Together', NULL, 'Lyrics for We Gather Together — add via Admin panel', true, 'golden_bells'),
(63, 'Come Thou Fount of Every Blessing', NULL, 'Lyrics for Come Thou Fount of Every Blessing — add via Admin panel', true, 'golden_bells'),
(64, 'Come We That Love the Lord', NULL, 'Lyrics for Come We That Love the Lord — add via Admin panel', true, 'golden_bells'),
(65, 'Marching to Zion', NULL, 'Lyrics for Marching to Zion — add via Admin panel', true, 'golden_bells'),
(66, 'This Is My Father''s World', NULL, 'Lyrics for This Is My Father''s World — add via Admin panel', true, 'golden_bells'),
(67, 'For the Beauty of the Earth', NULL, 'Lyrics for For the Beauty of the Earth — add via Admin panel', true, 'golden_bells'),
(68, 'Now Thank We All Our God', NULL, 'Lyrics for Now Thank We All Our God — add via Admin panel', true, 'golden_bells'),
(69, 'Come Thou Almighty King', NULL, 'Lyrics for Come Thou Almighty King — add via Admin panel', true, 'golden_bells'),
(70, 'Holy Spirit Thou Art Welcome', NULL, 'Lyrics for Holy Spirit Thou Art Welcome — add via Admin panel', true, 'golden_bells'),
(71, 'Spirit of God Descend Upon My Heart', NULL, 'Lyrics for Spirit of God Descend Upon My Heart — add via Admin panel', true, 'golden_bells'),
(72, 'Open My Eyes That I May See', NULL, 'Lyrics for Open My Eyes That I May See — add via Admin panel', true, 'golden_bells'),
(73, 'Open the Eyes of My Heart', NULL, 'Lyrics for Open the Eyes of My Heart — add via Admin panel', true, 'golden_bells'),
(74, 'Have Thine Own Way Lord', NULL, 'Lyrics for Have Thine Own Way Lord — add via Admin panel', true, 'golden_bells'),
(75, 'Make Me a Blessing', NULL, 'Lyrics for Make Me a Blessing — add via Admin panel', true, 'golden_bells'),
(76, 'Make Me a Channel of Your Peace', NULL, 'Lyrics for Make Me a Channel of Your Peace — add via Admin panel', true, 'golden_bells'),
(77, 'Lord Lay Some Soul Upon My Heart', NULL, 'Lyrics for Lord Lay Some Soul Upon My Heart — add via Admin panel', true, 'golden_bells'),
(78, 'Souls for Jesus Is Our Battle Cry', NULL, 'Lyrics for Souls for Jesus Is Our Battle Cry — add via Admin panel', true, 'golden_bells'),
(79, 'Send Me O Lord Send Me', NULL, 'Lyrics for Send Me O Lord Send Me — add via Admin panel', true, 'golden_bells'),
(80, 'Go Tell It on the Mountain', NULL, 'Lyrics for Go Tell It on the Mountain — add via Admin panel', true, 'golden_bells'),
(81, 'This Little Light of Mine', NULL, 'Lyrics for This Little Light of Mine — add via Admin panel', true, 'golden_bells'),
(82, 'Joy to the World', NULL, 'Lyrics for Joy to the World — add via Admin panel', true, 'golden_bells'),
(83, 'Silent Night', NULL, 'Lyrics for Silent Night — add via Admin panel', true, 'golden_bells'),
(84, 'O Little Town of Bethlehem', NULL, 'Lyrics for O Little Town of Bethlehem — add via Admin panel', true, 'golden_bells'),
(85, 'Away in a Manger', NULL, 'Lyrics for Away in a Manger — add via Admin panel', true, 'golden_bells'),
(86, 'The First Noel', NULL, 'Lyrics for The First Noel — add via Admin panel', true, 'golden_bells'),
(87, 'Angels We Have Heard on High', NULL, 'Lyrics for Angels We Have Heard on High — add via Admin panel', true, 'golden_bells'),
(88, 'It Came Upon the Midnight Clear', NULL, 'Lyrics for It Came Upon the Midnight Clear — add via Admin panel', true, 'golden_bells'),
(89, 'Good Christian Men Rejoice', NULL, 'Lyrics for Good Christian Men Rejoice — add via Admin panel', true, 'golden_bells'),
(90, 'Christ the Lord Is Risen Today', NULL, 'Lyrics for Christ the Lord Is Risen Today — add via Admin panel', true, 'golden_bells'),
(91, 'Low in the Grave He Lay', NULL, 'Lyrics for Low in the Grave He Lay — add via Admin panel', true, 'golden_bells'),
(92, 'Thine Is the Glory', NULL, 'Lyrics for Thine Is the Glory — add via Admin panel', true, 'golden_bells'),
(93, 'Because He Lives', NULL, 'Lyrics for Because He Lives — add via Admin panel', true, 'golden_bells'),
(94, 'There Is a Redeemer', NULL, 'Lyrics for There Is a Redeemer — add via Admin panel', true, 'golden_bells'),
(95, 'Majesty Worship His Majesty', NULL, 'Lyrics for Majesty Worship His Majesty — add via Admin panel', true, 'golden_bells'),
(96, 'How Majestic Is Your Name', NULL, 'Lyrics for How Majestic Is Your Name — add via Admin panel', true, 'golden_bells'),
(97, 'Great Are You Lord', NULL, 'Lyrics for Great Are You Lord — add via Admin panel', true, 'golden_bells'),
(98, 'Shout to the Lord', NULL, 'Lyrics for Shout to the Lord — add via Admin panel', true, 'golden_bells'),
(99, 'Lord I Lift Your Name on High', NULL, 'Lyrics for Lord I Lift Your Name on High — add via Admin panel', true, 'golden_bells'),
(100, 'You Are My All in All', NULL, 'Lyrics for You Are My All in All — add via Admin panel', true, 'golden_bells');