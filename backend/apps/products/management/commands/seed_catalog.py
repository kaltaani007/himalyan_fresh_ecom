import os
from pathlib import Path
from decimal import Decimal
from django.core.files import File
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils import timezone

from apps.products.models import Category, District, Product, ProductImage, Review
from apps.content.models import BlogCategory, BlogPost, Testimonial

User = get_user_model()


class Command(BaseCommand):
    help = "Seeds categories, districts, products, blogs, testimonials, reviews, and structured media files into Django."

    def handle(self, *args, **options):
        repo_root = Path(settings.BASE_DIR).parent
        assets_dir = repo_root / "frontend" / "src" / "assets" / "images"

        # Ensure media subdirectories exist cleanly
        for sub in ["categories", "products", "districts", "blog_posts", "testimonials", "banners"]:
            (Path(settings.MEDIA_ROOT) / sub).mkdir(parents=True, exist_ok=True)

        self.stdout.write(self.style.NOTICE("Seeding Categories & Category Media..."))
        categories_data = [
            {
                "name": "Royal Apples", "slug": "apples",
                "description": "Premium apples from Kinnaur and Shimla orchards",
                "local_image": assets_dir / "categories" / "royal-apples.jpg", "order": 1,
            },
            {
                "name": "Organic Fruits", "slug": "organic",
                "description": "Certified organic produce from mountain farms",
                "local_image": assets_dir / "categories" / "organic-fruits.jpg", "order": 2,
            },
            {
                "name": "Dry Fruits & Nuts", "slug": "dry-fruits",
                "description": "Premium walnuts, almonds and local nuts",
                "local_image": assets_dir / "categories" / "dry-fruits-nuts.jpg", "order": 3,
            },
            {
                "name": "Mountain Vegetables", "slug": "vegetables",
                "description": "Fresh seasonal vegetables from high altitudes",
                "local_image": assets_dir / "categories" / "mountain-vegetables.jpg", "order": 4,
            },
            {
                "name": "Honey & Preserves", "slug": "honey",
                "description": "Natural honey and traditional preserves",
                "local_image": assets_dir / "categories" / "honey-preserves.jpg", "order": 5,
            },
            {
                "name": "Herbal & Medicinal", "slug": "herbal",
                "description": "Ayurvedic herbs and medicinal plants",
                "local_image": assets_dir / "categories" / "herbal-medicinal.jpg", "order": 6,
            },
        ]

        category_map = {}
        for item in categories_data:
            cat, _ = Category.objects.update_or_create(
                slug=item["slug"],
                defaults={
                    "name": item["name"],
                    "description": item["description"],
                    "order": item["order"],
                    "is_active": True,
                },
            )
            local_path = item["local_image"]
            if local_path.exists() and not cat.image:
                with open(local_path, "rb") as f:
                    cat.image.save(local_path.name, File(f), save=True)
            category_map[item["slug"]] = cat

        self.stdout.write(self.style.NOTICE("Seeding 12 Himachal Districts..."))
        districts_data = [
            ("Shimla", "shimla", "The Queen of Hills, known for its apple orchards and colonial heritage.", "https://images.unsplash.com/photo-1585938389612-a552a28d6914?w=800&q=80", ["Red Delicious Apples", "Plums", "Peaches", "Cherries"], "2,200 m", "2.1 million", ["Mall Road", "Christ Church", "Kalka-Shimla Railway"], "Temperate"),
            ("Kinnaur", "kinnaur", "The land of apples, famous for premium quality apples and black walnuts.", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", ["Red Delicious", "Black Walnuts", "Apricots", "Kangra Apples"], "2,300-6,500 m", "0.9 million", ["Kinnaur Kailash", "Kalpa Monastery", "Apple Orchards"], "Cold Desert"),
            ("Kullu", "kullu", "Valley of gods, known for apples, cherries and scenic beauty.", "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80", ["Apples", "Cherries", "Pears", "Plums"], "1,500 m", "0.4 million", ["Great Himalayan National Park", "Kullu Dussehra", "Beas River"], "Temperate"),
            ("Mandi", "mandi", "The rice bowl of Himachal with rich agricultural heritage.", "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80", ["Basmati Rice", "Vegetables", "Maize", "Potatoes"], "800 m", "1.0 million", ["Rewalsar Lake", "Panjeshwar Temples", "Bilaspur"], "Sub-Tropical"),
            ("Kangra", "kangra", "Historic valley famous for tea, almonds and Buddhist temples.", "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80", ["Green Tea", "Almonds", "Honey", "Kangra Fort"], "600 m", "1.5 million", ["Kangra Fort", "Brajeshwari Temple", "Tea Gardens"], "Sub-Tropical"),
            ("Chamba", "chamba", "Ancient valley with rich tradition of fruit cultivation.", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", ["Apples", "Plums", "Apricots", "Chukh"], "1,000 m", "0.5 million", ["Chamba Palace", "Bhuri Singh Museum", "Mini Switzerland"], "Temperate"),
            ("Solan", "solan", "The mushroom capital known for its agricultural innovation.", "https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=800&q=80", ["Mushrooms", "Green Peas", "Tomatoes", "Vegetables"], "1,500 m", "0.6 million", ["Mohan Shakti Park", "Kumarhatti", "Buddhist Monastery"], "Sub-Temperate"),
            ("Sirmaur", "sirmaur", "Diverse agriculture zone with citrus fruits and spices.", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", ["Citrus", "Ginger", "Turmeric", "Mangoes"], "400-1,500 m", "0.55 million", ["Renuka Lake", "Koti", "Nagar Palace"], "Sub-Tropical"),
            ("Lahaul-Spiti", "lahaul-spiti", "Cold desert region with unique mountain agriculture.", "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80", ["Potatoes", "Green Peas", "Barley", "Seabuckthorn"], "3,000-6,000 m", "0.03 million", ["Kunzum Pass", "Hikkim", "Key Monastery"], "Cold Desert"),
            ("Bilaspur", "bilaspur", "Emerging apple belt with growing orchards.", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", ["Apples", "Mangoes", "Vegetables", "Wheat"], "400 m", "0.38 million", ["Gobind Sagar", "Naina Devi Temple", "Bharmour"], "Sub-Tropical"),
            ("Hamirpur", "hamirpur", "Progressive farming community with diverse crops.", "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80", ["Wheat", "Maize", "Vegetables", "Pulses"], "700 m", "0.5 million", ["Sujanpur Tira", "Tahnung Temple", "Bilbagh"], "Sub-Tropical"),
            ("Una", "una", "Gateway district with fertile plains and orchards.", "https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=800&q=80", ["Sugarcane", "Wheat", "Fruits", "Vegetables"], "400 m", "0.55 million", ["Dharamshala", "Chintpurni Temple", "Garner"], "Sub-Tropical"),
        ]

        district_map = {}
        for idx, (name, slug, desc, img_url, specs, alt, pop, famous, climate) in enumerate(districts_data, start=1):
            dist, _ = District.objects.update_or_create(
                slug=slug,
                defaults={
                    "name": name,
                    "description": desc,
                    "image_url": img_url,
                    "specialties": specs,
                    "altitude": alt,
                    "population": pop,
                    "famous_for": famous,
                    "climate": climate,
                    "order": idx,
                    "is_active": True,
                },
            )
            district_map[slug] = dist

        self.stdout.write(self.style.NOTICE("Seeding Products & Product Catalog Media..."))
        products_data = [
            {
                "name": "Royal Red Delicious Apples", "slug": "royal-red-delicious", "sku": "HF-APP-001",
                "description": "Exceptionally sweet and crispy apples from Kinnaur valley.",
                "full_description": "Premium Red Delicious apples from Kinnaur. Handpicked at peak crispness with 100% natural wax-free skin.",
                "base_price": Decimal("749.00"), "discount_price": Decimal("599.00"),
                "category": "apples", "district": "kinnaur", "origin": "Kinnaur", "weight": "1 kg",
                "is_featured": True, "is_bestseller": True, "is_seasonal": True,
                "badges": ["Farm Fresh", "Handpicked"], "tags": ["apples"],
                "local_image": assets_dir / "Kinnaur Royal Red Apple Showcase.png",
                "fallback_url": "",
            },
            {
                "name": "Golden Delicious Premium", "slug": "golden-delicious-premium", "sku": "HF-APP-002",
                "description": "Balanced sweetness and tartness from high-elevation Shimla orchards.",
                "full_description": "Naturally honey-sweet Golden Delicious apples with crisp yellow skin and zero synthetic wax coating.",
                "base_price": Decimal("449.00"), "discount_price": None,
                "category": "apples", "district": "shimla", "origin": "Shimla", "weight": "1 kg",
                "is_featured": True, "is_bestseller": False, "is_seasonal": True,
                "badges": ["Organic"], "tags": ["apples"],
                "local_image": assets_dir / "products" / "golden-delicious.jpg",
                "fallback_url": "",
            },
            {
                "name": "Organic Strawberries", "slug": "organic-strawberries", "sku": "HF-ORG-003",
                "description": "Sun-ripened organic mountain strawberries picked fresh at dawn.",
                "full_description": "Juicy crimson berries grown in mineral-rich Kullu valley soil without chemical pesticides.",
                "base_price": Decimal("399.00"), "discount_price": Decimal("299.00"),
                "category": "organic", "district": "kullu", "origin": "Kullu", "weight": "500g",
                "is_featured": True, "is_bestseller": True, "is_seasonal": True,
                "badges": ["Farm Fresh"], "tags": ["organic"],
                "local_image": assets_dir / "categories" / "organic-fruits.jpg",
                "fallback_url": "",
            },
            {
                "name": "Kinnaur Black Walnuts", "slug": "kinnaur-black-walnuts", "sku": "HF-DRY-004",
                "description": "Premium black walnuts rich in natural omega-3 oils.",
                "full_description": "Wild-harvested Kinnaur high-altitude walnuts with deeply flavorful golden kernels.",
                "base_price": Decimal("899.00"), "discount_price": None,
                "category": "dry-fruits", "district": "kinnaur", "origin": "Kinnaur", "weight": "250g",
                "is_featured": True, "is_bestseller": False, "is_seasonal": False,
                "badges": ["Handpicked"], "tags": ["nuts"],
                "local_image": assets_dir / "products" / "kinnaur-black-walnuts.jpg",
                "fallback_url": "",
            },
            {
                "name": "Alpine Cherry Premium", "slug": "alpine-cherry", "sku": "HF-ORG-005",
                "description": "Sweet deep-crimson cherries from Kullu valleys.",
                "full_description": "Limited-harvest Himalayan sweet cherries chilled immediately after harvest for maximum crunch.",
                "base_price": Decimal("899.00"), "discount_price": Decimal("699.00"),
                "category": "organic", "district": "kullu", "origin": "Kullu", "weight": "500g",
                "is_featured": True, "is_bestseller": True, "is_seasonal": True,
                "badges": ["Seasonal"], "tags": ["fruits"],
                "local_image": assets_dir / "products" / "alpine-cherries.jpg",
                "fallback_url": "",
            },
            {
                "name": "Mountain Organic Potatoes", "slug": "mountain-potatoes", "sku": "HF-VEG-006",
                "description": "Earth-grown heirloom potatoes from high altitude farms.",
                "full_description": "Dense, creamy Pahadi potatoes cultivated in pristine mountain soil in Mandi.",
                "base_price": Decimal("149.00"), "discount_price": None,
                "category": "vegetables", "district": "mandi", "origin": "Mandi", "weight": "2 kg",
                "is_featured": False, "is_bestseller": False, "is_seasonal": False,
                "badges": ["Farm Fresh"], "tags": ["vegetables"],
                "local_image": assets_dir / "categories" / "mountain-vegetables.jpg",
                "fallback_url": "",
            },
            {
                "name": "Raw Organic Honey", "slug": "raw-organic-honey", "sku": "HF-HON-007",
                "description": "Pure unheated multiflora honey from Himalayan mountain apiaries.",
                "full_description": "Raw, unfiltered wildflower honey gathered by mountain bees across Kangra valley meadows.",
                "base_price": Decimal("599.00"), "discount_price": Decimal("499.00"),
                "category": "honey", "district": "kangra", "origin": "Kangra", "weight": "500ml",
                "is_featured": True, "is_bestseller": True, "is_seasonal": False,
                "badges": ["100% Pure"], "tags": ["honey"],
                "local_image": assets_dir / "products" / "raw-organic-honey.jpg",
                "fallback_url": "",
            },
            {
                "name": "Kangra Green Almonds", "slug": "kangra-green-almonds", "sku": "HF-DRY-008",
                "description": "Premium mountain almonds rich in natural vitamins and oils.",
                "full_description": "Unbleached high-oil Himalayan almonds harvested directly from native orchards.",
                "base_price": Decimal("549.00"), "discount_price": None,
                "category": "dry-fruits", "district": "kangra", "origin": "Kangra", "weight": "250g",
                "is_featured": False, "is_bestseller": False, "is_seasonal": False,
                "badges": ["Handpicked"], "tags": ["nuts"],
                "local_image": assets_dir / "categories" / "dry-fruits-nuts.jpg",
                "fallback_url": "",
            },
            {
                "name": "Alpine Plums", "slug": "alpine-plums", "sku": "HF-ORG-009",
                "description": "Sweet aromatic purple plums from the Chamba hills.",
                "full_description": "Tree-ripened Santa Rosa plums bursting with sweet-tart mountain flavor.",
                "base_price": Decimal("249.00"), "discount_price": None,
                "category": "organic", "district": "chamba", "origin": "Chamba", "weight": "500g",
                "is_featured": False, "is_bestseller": False, "is_seasonal": True,
                "badges": ["Seasonal"], "tags": ["fruits"],
                "local_image": assets_dir / "categories" / "organic-fruits.jpg",
                "fallback_url": "",
            },
            {
                "name": "Mountain Green Tea", "slug": "mountain-green-tea", "sku": "HF-HRB-010",
                "description": "Whole-leaf orthodox green tea from historic Kangra estates.",
                "full_description": "Hand-rolled first-flush Kangra green tea leaves rich in antioxidants and floral notes.",
                "base_price": Decimal("399.00"), "discount_price": None,
                "category": "herbal", "district": "kangra", "origin": "Kangra", "weight": "100g",
                "is_featured": True, "is_bestseller": True, "is_seasonal": False,
                "badges": ["Organic"], "tags": ["tea"],
                "local_image": assets_dir / "products" / "mountain-green-tea.jpg",
                "fallback_url": "",
            },
            {
                "name": "Red Delicious Premium Box", "slug": "red-delicious-box", "sku": "HF-APP-011",
                "description": "Luxury artisanal gift box of export-grade Kinnaur apples.",
                "full_description": "Hand-selected single-orchard Kinnaur Royal Red Delicious apples presented in a luxury keepsake box.",
                "base_price": Decimal("1599.00"), "discount_price": Decimal("1299.00"),
                "category": "apples", "district": "kinnaur", "origin": "Kinnaur", "weight": "2.5 kg",
                "is_featured": True, "is_bestseller": False, "is_seasonal": True,
                "badges": ["Gift Box"], "tags": ["gift"],
                "local_image": assets_dir / "products" / "red-delicious-gift-box.jpg",
                "fallback_url": "",
            },
            {
                "name": "Mixed Berry Preserve", "slug": "mixed-berry-preserve", "sku": "HF-HON-012",
                "description": "Small-batch traditional preserve crafted from wild mountain berries.",
                "full_description": "Slow-cooked Himachali berry preserve with zero artificial pectin or refined preservatives.",
                "base_price": Decimal("299.00"), "discount_price": None,
                "category": "honey", "district": "solan", "origin": "Solan", "weight": "350g",
                "is_featured": False, "is_bestseller": False, "is_seasonal": False,
                "badges": ["Traditional"], "tags": ["preserve"],
                "local_image": assets_dir / "categories" / "honey-preserves.jpg",
                "fallback_url": "",
            },
        ]

        product_map = {}
        for pdata in products_data:
            prod, _ = Product.objects.update_or_create(
                slug=pdata["slug"],
                defaults={
                    "name": pdata["name"],
                    "sku": pdata["sku"],
                    "description": pdata["description"],
                    "full_description": pdata["full_description"],
                    "base_price": pdata["base_price"],
                    "discount_price": pdata["discount_price"],
                    "category": category_map[pdata["category"]],
                    "district": district_map.get(pdata["district"]),
                    "origin": pdata["origin"],
                    "weight": pdata["weight"],
                    "is_featured": pdata["is_featured"],
                    "is_bestseller": pdata["is_bestseller"],
                    "is_seasonal": pdata["is_seasonal"],
                    "badges": pdata["badges"],
                    "tags": pdata["tags"],
                    "in_stock": True,
                    "is_active": True,
                },
            )
            product_map[pdata["slug"]] = prod

            if not prod.images.exists():
                local_img = pdata["local_image"]
                if local_img and local_img.exists():
                    img_rec = ProductImage(
                        product=prod,
                        alt_text=pdata["name"],
                        is_primary=True,
                        order=0,
                    )
                    with open(local_img, "rb") as f:
                        safe_filename = f"{pdata['slug']}{local_img.suffix.lower()}"
                        img_rec.image.save(safe_filename, File(f), save=True)
                elif pdata["fallback_url"]:
                    ProductImage.objects.create(
                        product=prod,
                        image_url=pdata["fallback_url"],
                        alt_text=pdata["name"],
                        is_primary=True,
                        order=0,
                    )

        self.stdout.write(self.style.NOTICE("Seeding Blogs & Blog Categories..."))
        blogs_data = [
            ("The Art of Apple Growing in Kinnaur Valley", "art-apple-growing-kinnaur", "Orchard Life", "orchard-life", "kinnaur", "Discover the centuries-old traditions of apple cultivation in the high-altitude orchards of Kinnaur, where every apple tells a story of heritage and patience.", "<p>Kinnaur valley, nestled in the lap of the Himalayas, has been producing world-class apples for over a century. Grown between 2,300m and 3,200m altitude, crisp alpine nights lock in extraordinary natural fructose.</p><h2>The Perfect Alpine Climate</h2><p>Glacier-fed mineral streams and intense mountain sunshine give Kinnaur apples their unmistakable ruby blush and natural wax-free bloom.</p>", assets_dir / "categories" / "royal-apples.jpg", "Rajesh Kumar", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80", "Third generation apple farmer from Kinnaur", "Farmer", True, True, 4523, 234),
            ("Seasonal Guide: When to Pick the Best Himachal Fruits", "seasonal-fruit-guide-himachal", "Seasonal Guide", "seasonal-guide", "kullu", "A comprehensive guide to the best seasons for harvesting different fruits in Himachal Pradesh.", "<p>Understanding the seasonal harvest calendar of Himachal Pradesh is key to enjoying the freshest mountain produce from spring cherries to late-autumn Kinnaur apples.</p>", assets_dir / "categories" / "organic-fruits.jpg", "Anita Devi", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80", "Agricultural expert and food writer", "Expert", True, False, 2891, 156),
            ("From Farm to Table: The Journey of Himachal Honey", "farm-to-table-himachal-honey", "Farm Stories", "farm-stories", "kangra", "Follow the fascinating journey of honey from mountain apiaries to your breakfast table.", "<p>Mountain honey from Himachal Pradesh is celebrated for its raw enzymes, rich amber color, and wildflowers gathered across untouched alpine pastures.</p>", assets_dir / "products" / "raw-organic-honey.jpg", "Pankaj Thakur", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80", "Beekeeper and honey enthusiast", "Producer", False, True, 3456, 189),
            ("Traditional Kangra Tea: A Legacy in Every Cup", "kangra-tea-legacy", "Heritage", "heritage", "kangra", "Explore the rich history of tea cultivation in Kangra and discover what makes these mountain-grown leaves so special.", "<p>The terraced tea gardens of Kangra Valley have produced GI-tagged aromatic green and black teas since the 19th century.</p>", assets_dir / "products" / "mountain-green-tea.jpg", "Anita Devi", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80", "Agricultural expert and food writer", "Expert", True, False, 2134, 112),
            ("Preserving the Season: Making Apple Preserves the Himachali Way", "apple-preserves-himachali", "Recipes", "recipes", "shimla", "Learn the traditional methods of preserving mountain apples and berries passed down through generations.", "<p>In Himachali households, preserving the autumn harvest in small copper kettles ensures mountain sweetness lasts through snowy winters.</p>", assets_dir / "categories" / "honey-preserves.jpg", "Sunita Devi", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80", "Traditional cooking expert", "Chef", False, False, 1876, 98),
            ("Sustainable Farming: How Himachal Farmers Are Leading the Way", "sustainable-farming-himachal", "Sustainability", "sustainability", "mandi", "Discover how traditional farming practices combined with regenerative techniques protect Himalayan biodiversity.", "<p>Himachal Pradesh has become a global model for natural, wax-free, zero-chemical mountain agriculture supporting 840+ partner orchards.</p>", assets_dir / "categories" / "mountain-vegetables.jpg", "Dr. Vikram Singh", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80", "Agricultural scientist", "Researcher", True, True, 5234, 287),
        ]

        for idx, (title, slug, cat_name, cat_slug, dist_slug, excerpt, content, local_img, author_name, avatar, bio, role, feat, trend, views, likes) in enumerate(blogs_data, start=1):
            bcat, _ = BlogCategory.objects.update_or_create(
                slug=cat_slug,
                defaults={"name": cat_name, "order": idx, "is_active": True},
            )
            post, _ = BlogPost.objects.update_or_create(
                slug=slug,
                defaults={
                    "title": title,
                    "excerpt": excerpt,
                    "content": content,
                    "category": bcat,
                    "district": district_map.get(dist_slug),
                    "author_name": author_name,
                    "author_avatar_url": avatar,
                    "author_bio": bio,
                    "author_role": role,
                    "status": "published",
                    "published_at": timezone.now() - timezone.timedelta(days=idx * 4),
                    "is_featured": feat,
                    "is_trending": trend,
                    "view_count": views,
                    "like_count": likes,
                },
            )
            if local_img.exists() and not post.featured_image:
                with open(local_img, "rb") as f:
                    post.featured_image.save(f"blog-{slug}{local_img.suffix.lower()}", File(f), save=True)

        self.stdout.write(self.style.NOTICE("Seeding Testimonials & Verified Reviews..."))
        testimonials_data = [
            ("Priya Sharma", "Mumbai", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop", 5, "Royal Red Delicious", "The Kinnaur apples were crisp, juicy, and completely wax-free. You can immediately smell the fresh mountain orchard aroma the moment you open the box."),
            ("Dr. Rajeev Mehra", "Delhi NCR", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop", 5, "Alpine Cherries", "Incredible authenticity. These taste like the fresh cherries we had during our road trip to Kullu valley. Prompt 2-day delivery and flawless packaging."),
            ("Anita Gupta", "Bangalore", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop", 5, "Kinnaur Black Walnuts", "The black walnuts are so rich in omega-3 oil and taste far superior to commercial imported nuts. So happy to support Himalayan farmers directly."),
        ]
        for idx, (name, loc, avatar, rating, prod_name, text) in enumerate(testimonials_data, start=1):
            Testimonial.objects.update_or_create(
                name=name,
                location=loc,
                defaults={
                    "avatar_url": avatar,
                    "rating": rating,
                    "product_name": prod_name,
                    "text": text,
                    "order": idx,
                    "is_active": True,
                },
            )

        # Seed sample verified customer reviews on flagship product
        royal_apple = product_map.get("royal-red-delicious")
        if royal_apple:
            reviewers = [
                ("priya.sharma@example.com", "Priya", "Sharma", 5, "Crisp & Wax-Free!", "The apples are incredibly fresh and crispy. Best quality I have found online. My family loves them!"),
                ("rahul.verma@example.com", "Rahul", "Verma", 5, "Authentic Kinnaur Taste", "Excellent cold-chain delivery and premium packaging. True mountain sweetness."),
                ("anita.patel@example.com", "Anita", "Patel", 4, "Reliable Mountain Source", "Finally found a reliable source for Himachal apples. The flavor is unmatched. Will definitely order again!"),
            ]
            for email, first, last, rating, title, comment in reviewers:
                user, created = User.objects.get_or_create(
                    email=email,
                    defaults={"username": email.split("@")[0], "first_name": first, "last_name": last},
                )
                if created:
                    user.set_unusable_password()
                    user.save()
                Review.objects.update_or_create(
                    product=royal_apple,
                    user=user,
                    defaults={
                        "rating": rating,
                        "title": title,
                        "comment": comment,
                        "is_verified_purchase": True,
                        "helpful_count": 18,
                    },
                )

        self.stdout.write(self.style.SUCCESS(
            f"Successfully seeded Django catalog: "
            f"{Category.objects.count()} categories, "
            f"{District.objects.count()} districts, "
            f"{Product.objects.count()} products, "
            f"{ProductImage.objects.count()} product images, "
            f"{BlogPost.objects.count()} blogs, "
            f"{Testimonial.objects.count()} testimonials."
        ))
