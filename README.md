# KhatAvar — خط‌آور

نسخه‌ی Foundation + Core Editor از استودیوی تایپوگرافی فارسی KhatAvar.

## اجرا

```bash
npm install
npm run dev
```

برای build:

```bash
npm run build
```

## وضعیت این نسخه

- معماری React/Vite ماژولار
- UI فارسی-first با Vazirmatn
- Dark / Light / System
- Artboard قابل تغییر اندازه و Zoom
- ایجاد، انتخاب، جابه‌جایی، چرخش و Scale متن
- Properties panel با فیلدهای عددی دقیق
- سه scope: متن، کلمات، کاراکترها
- Layers panel با visibility و lock
- Undo / Redo با history معنی‌دار
- ذخیره‌ی پروژه در localStorage
- خروجی SVG و PNG بدون UI ادیتور
- import فونت TTF/OTF در مرورگر با FontFace
- طراحی responsive برای desktop/mobile

## نکته‌ی فنی

ویرایش مستقل کاراکترهای فارسی ذاتاً به shaping و joining وابسته است. این نسخه برای نمایش مستقل کاراکترها از spanهای جدا استفاده می‌کند و برای ویرایش حرفه‌ای glyph-level در نسخه‌های بعدی باید shaping engine مناسب اضافه شود.

این پروژه عمداً بدون وابستگی سنگین canvas/editor ساخته شده تا معماری قابل توسعه بماند.
