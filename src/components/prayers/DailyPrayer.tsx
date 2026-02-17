export function DailyPrayer() {
  const hour = new Date().getHours()
  
  const getPrayer = () => {
    if (hour < 12) {
      return {
        title: 'Morning Prayer (Matins)',
        content: `O Lord, open thou our lips.
And our mouth shall show forth thy praise.

Glory be to the Father, and to the Son, and to the Holy Ghost;
As it was in the beginning, is now, and ever shall be, world without end. Amen.

Praise ye the Lord.
The Lord's Name be praised.

Almighty God, who hast given us grace at this time with one accord to make our common supplications unto thee; and dost promise that when two or three are gathered together in thy Name thou wilt grant their requests: Fulfil now, O Lord, the desires and petitions of thy servants, as may be most expedient for them; granting us in this world knowledge of thy truth, and in the world to come life everlasting. Amen.`
      }
    } else if (hour < 18) {
      return {
        title: 'Midday Prayer',
        content: `Blessed Saviour, at this hour you hung upon the cross, stretching out your loving arms: Grant that all the peoples of the earth may look to you and be saved; for your mercies' sake. Amen.

Almighty God, whose most dear Son went not up to joy but first he suffered pain, and entered not into glory before he was crucified: Mercifully grant that we, walking in the way of the cross, may find it none other than the way of life and peace; through Jesus Christ our Lord. Amen.`
      }
    } else {
      return {
        title: 'Evening Prayer (Evensong)',
        content: `O God, make speed to save us.
O Lord, make haste to help us.

Glory be to the Father, and to the Son, and to the Holy Ghost;
As it was in the beginning, is now, and ever shall be, world without end. Amen.

Praise ye the Lord.
The Lord's Name be praised.

Lighten our darkness, we beseech thee, O Lord; and by thy great mercy defend us from all perils and dangers of this night; for the love of thy only Son, our Saviour Jesus Christ. Amen.`
      }
    }
  }

  const prayer = getPrayer()

  return (
    <div className="bg-navy text-white rounded-lg p-6">
      <h2 className="text-2xl font-playfair mb-4 text-gold">{prayer.title}</h2>
      <div className="font-lora text-lg leading-relaxed whitespace-pre-line">
        {prayer.content}
      </div>
    </div>
  )
}
