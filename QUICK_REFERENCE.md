# Quick Reference Card

## 🎯 Feature Access Points

### For Members:

| Feature | How to Access | What You Can Do |
|---------|--------------|-----------------|
| **Offline Bible** | Bible → Offline tab | Download books, delete downloads |
| **Share Bible** | Bible → Read chapter → WhatsApp button | Share verses on WhatsApp |
| **Share Sermons** | Sermons → Click sermon → Share button | Share sermon on WhatsApp |
| **Share Prayers** | Prayers → Daily Prayer → Share button | Share prayer on WhatsApp |
| **Join Cell WhatsApp** | Cell Groups → Select group → Join button | Join cell group WhatsApp |
| **Referral Program** | Profile → View Referral Program | Get code, share link, track referrals |

### For Admins/Leaders:

| Feature | How to Access | What You Can Do |
|---------|--------------|-----------------|
| **Add WhatsApp Link** | Admin → Cell Groups → Edit group | Enable WhatsApp, add invite link |
| **View Referrals** | Supabase → referrals table | See all referral relationships |
| **Monitor Downloads** | Supabase → offline_bible_downloads | See what users downloaded |

## 🔗 Important URLs

- Referral page: `/referrals`
- Register with referral: `/register?ref=YOUR_CODE`
- Cell groups: `/cell-groups`
- Bible offline: `/bible` (Offline tab)

## 📊 Database Quick Queries

### Top Referrers
```sql
SELECT p.full_name, COUNT(r.id) as referrals
FROM profiles p
LEFT JOIN referrals r ON r.referrer_id = p.id
GROUP BY p.id
ORDER BY referrals DESC
LIMIT 10;
```

### Most Downloaded Books
```sql
SELECT book_name, COUNT(*) as downloads
FROM offline_bible_downloads
GROUP BY book_name
ORDER BY downloads DESC;
```

### Cell Groups with WhatsApp
```sql
SELECT name, whatsapp_enabled
FROM cell_groups
WHERE whatsapp_enabled = true;
```

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Referral code not showing | Run migration, check profiles.referral_code exists |
| WhatsApp button not working | Check browser allows opening WhatsApp links |
| Downloads not saving | Check user is logged in, verify RLS policies |
| Cell group link not showing | Verify whatsapp_enabled = true and link is set |

## 📞 Support

- Check SETUP_GUIDE.md for detailed troubleshooting
- Review IMPLEMENTATION_SUMMARY.md for complete documentation
- Test features following the usage examples

---

**Quick Start:** Run migration → Test features → Add WhatsApp links → Share referrals!
