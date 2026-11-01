from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.products.models import Category, Product, ProductImage, Banner, Coupon
from apps.content.models import BlogCategory, BlogPost, BlogTag
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed database with Himachal Pradesh specific data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding Himachal data...')

        self.create_categories()
        self.stdout.write(self.style.SUCCESS('✓ Categories created'))

        self.create_products()
        self.stdout.write(self.style.SUCCESS('✓ Products created'))

        self.create_banners()
        self.stdout.write(self.style.SUCCESS('✓ Banners created'))

        self.create_coupons()
        self.stdout.write(self.style.SUCCESS('✓ Coupons created'))

        self.stdout.write(self.style.SUCCESS('\n✅ Himachal data seeded successfully!'))

    def create_categories(self):
        categories_data = [
            {
                'name': 'Premium Apples',
                'slug': 'apples',
                'description': 'Fresh apples from Kinnaur, Shimla, and Kullu valleys - known for their natural sweetness and crisp texture',
                'order': 1
            },
            {
                'name': 'Organic Vegetables',
                'slug': 'organic-vegetables',
                'description': 'Farm-fresh organic vegetables grown in the pristine climate of Himachal hills',
                'order': 2
            },
            {
                'name': 'Kangra Products',
                'slug': 'kangra',
                'description': 'Traditional Kangra art, crafts, and produce from the ancient kingdom of Kangra',
                'order': 3
            },
            {
                'name': 'Spices & Herbs',
                'slug': 'spices-herbs',
                'description': 'Aromatic spices and medicinal herbs from the Himalayan forests',
                'order': 4
            },
            {
                'name': 'Dry Fruits',
                'slug': 'dry-fruits',
                'description': 'Premium dry fruits and nuts from the cold climate of Himachal Pradesh',
                'order': 5
            },
            {
                'name': 'Honey & Preserves',
                'slug': 'honey-preserves',
                'description': 'Pure mountain honey, jams, and preserves made from local fruits',
                'order': 6
            },
        ]

        for cat_data in categories_data:
            Category.objects.update_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )

    def create_products(self):
        # Real Himachal Apple Images from Unsplash
        apple_images = [
            'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800',
            'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=800',
            'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800',
        ]

        products_data = [
            {
                'name': 'Royal Delicious Apples - Kinnaur',
                'slug': 'royal-delicious-kinnaur',
                'sku': 'APP-ROYAL-KIN-001',
                'description': '''These Royal Delicious apples are hand-picked from the orchards of Kinnaur valley. 
                Grown at an altitude of 10,000 feet, these apples develop their signature sweetness and crisp texture.
                
                Each apple is naturally grown without any artificial growth substances. The unique climate of Kinnaur - 
                with its cold winters and pleasant summers - creates the perfect conditions for these world-class apples.
                
                Perfect for: Fresh eating, fruit salads, apple pies, juices''',
                'category_slug': 'apples',
                'base_price': 350,
                'discount_price': 299,
                'is_featured': True,
                'brand': 'Kinnaur Orchards',
            },
            {
                'name': 'Himachali Red Apples - Shimla Hills',
                'slug': 'himachali-red-shimla',
                'sku': 'APP-RED-SHIM-002',
                'description': '''Rich red apples from the legendary apple belt of Shimla. These apples are known for their 
                perfect balance of sweetness and acidity.
                
                Our farmers in Chopal and Rohru have been growing these apples for generations using traditional 
                methods passed down through families. No pesticides, only organic fertilizers.
                
                Storage Tip: Keep in cool, dry place for up to 2 weeks. Refrigerate for longer freshness.''',
                'category_slug': 'apples',
                'base_price': 280,
                'discount_price': 249,
                'is_featured': True,
                'brand': 'Shimla Hills Co.',
            },
            {
                'name': 'Golden Delicious - Kullu Valley',
                'slug': 'golden-delicious-kullu',
                'sku': 'APP-GOLD-KULL-003',
                'description': '''Golden Delicious from Kullu valley - known for their golden hue and honey-like sweetness. 
                These are premium grade apples with minimal marks.
                
                Hand-selected from small orchards in Manali and Kullu region. Each box contains apples that have 
                been individually inspected for quality.
                
                Great for: Gift boxes, special occasions, daily consumption''',
                'category_slug': 'apples',
                'base_price': 420,
                'discount_price': 379,
                'is_featured': True,
                'brand': 'Kullu Fresh',
            },
            {
                'name': 'Organic Red Tomatoes - Manali',
                'slug': 'organic-red-tomatoes-manali',
                'sku': 'VEG-TOM-MAN-001',
                'description': '''Farm-fresh red tomatoes grown in the cold climate of Manali. These tomatoes are 
                naturally ripened on the vine - never artificially colored.
                
                Our organic farm in Manali uses traditional Himalayan farming techniques. No chemical fertilizers, 
                no pesticides - just pure mountain soil and sunshine.
                
                Perfect for: Cooking, salads, chutneys, pickle''',
                'category_slug': 'organic-vegetables',
                'base_price': 80,
                'discount_price': 65,
                'brand': 'Manali Organic Farm',
            },
            {
                'name': 'Kangra Wooden Box - Handcrafted',
                'slug': 'kangra-wooden-box',
                'sku': 'KNG-WOOD-001',
                'description': '''Beautiful handcrafted wooden box made by artisans in Kangra. Each piece is unique, 
                hand-carved by local craftsmen using traditional techniques passed down through generations.
                
                This box represents the rich heritage of Kangra craftsmanship. Perfect for storing spices, 
                dry fruits, or as a decorative piece.
                
                Dimensions: 8x6x4 inches
                Material: Pine wood from local forests''',
                'category_slug': 'kangra',
                'base_price': 650,
                'discount_price': 550,
                'is_featured': True,
                'brand': 'Kangra Artisans',
            },
            {
                'name': 'Kangra Tea - Premium Green',
                'slug': 'kangra-green-tea',
                'sku': 'KNG-TEA-001',
                'description': '''Premium green tea from Kangra region's famous tea gardens. Known as "Kangra tea" 
                this variety has been cultivated since the 19th century.
                
                Light, aromatic, and full of natural antioxidants. Hand-processed using traditional methods 
                to preserve the delicate flavor and health benefits.
                
                Brewing Tip: 1 tsp per cup, steep for 3-4 minutes at 80°C''',
                'category_slug': 'spices-herbs',
                'base_price': 280,
                'discount_price': 240,
                'brand': 'Kangra Tea Co.',
            },
            {
                'name': 'Walnuts - Chamba Valley',
                'slug': 'walnuts-chamba',
                'sku': 'DRY-WAL-001',
                'description': '''Premium walnuts from Chamba valley, known for their premium quality and rich flavor. 
                These walnuts are naturally cracked and hand-selected.
                
                Rich in omega-3 fatty acids and protein. Perfect for daily snacking, baking, or adding to 
                your morning breakfast.
                
                Note: All nuts are sun-dried, no artificial processing.''',
                'category_slug': 'dry-fruits',
                'base_price': 450,
                'discount_price': 399,
                'is_featured': True,
                'brand': 'Chamba Nuts',
            },
            {
                'name': 'Almonds - Kinnaur Premium',
                'slug': 'almonds-kinnaur',
                'sku': 'DRY-ALM-001',
                'description': '''Premium almonds from the high altitudes of Kinnaur. These are naturally grown 
                without any chemical treatments.
                
                Rich in Vitamin E and minerals. Our almonds are carefully sorted to ensure only the best 
                quality nuts reach you.
                
                Best consumed: Raw, or soaked overnight''',
                'category_slug': 'dry-fruits',
                'base_price': 520,
                'discount_price': 459,
                'brand': 'Kinnaur Dry Fruits',
            },
            {
                'name': 'Raw Himalayan Honey - Manali',
                'slug': 'raw-honey-manali',
                'sku': 'HNY-MAN-001',
                'description': '''Pure raw honey collected from beekeepers in Manali. This honey is unprocessed, 
                unheated, and straight from the hive.
                
                Honey from Himalayan wildflowers has unique medicinal properties. Natural crystallization 
                is a sign of pure honey - not a defect.
                
                Uses: Immunity, skin care, cooking, traditional remedies''',
                'category_slug': 'honey-preserves',
                'base_price': 350,
                'discount_price': 299,
                'is_featured': True,
                'brand': 'Manali Honey Co.',
            },
            {
                'name': 'Apple Jam - Shimla Traditional',
                'slug': 'apple-jam-shimla',
                'sku': 'JAM-APP-001',
                'description': '''Traditional apple jam made from Shimla apples using grandmother's recipe. 
                No artificial preservatives, colors, or flavors.
                
                Just apples, sugar, and a touch of lemon juice. Perfect for breakfast toast, 
                parathas, or as a dessert topping.
                
                Shelf Life: 12 months from manufacturing date''',
                'category_slug': 'honey-preserves',
                'base_price': 180,
                'discount_price': 150,
                'brand': 'Shimla Preserves',
            },
        ]

        for prod_data in products_data:
            category = Category.objects.filter(slug=prod_data.pop('category_slug')).first()
            if not category:
                continue

            product, created = Product.objects.update_or_create(
                slug=prod_data['slug'],
                defaults={
                    **prod_data,
                    'category': category,
                }
            )

            # Add images
            if created and prod_data.get('is_featured'):
                img_urls = [
                    f"https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800",
                    f"https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=800",
                ]
                for i, url in enumerate(img_urls):
                    ProductImage.objects.get_or_create(
                        product=product,
                        image=url,
                        defaults={
                            'is_primary': i == 0,
                            'order': i
                        }
                    )

    def create_banners(self):
        banners_data = [
            {
                'title': 'Fresh Kinnaur Apples',
                'subtitle': 'Direct from the orchards of Kinnaur valley',
                'image': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=1200',
                'link_url': '/products?category=apples',
                'position': 1,
            },
            {
                'title': 'Organic Kangra Produce',
                'subtitle': 'Traditional farming, pure ingredients',
                'image': 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=1200',
                'link_url': '/products?category=organic-vegetables',
                'position': 2,
            },
            {
                'title': 'Handcrafted Kangra Art',
                'subtitle': 'Treasures from the ancient Kangra region',
                'image': 'https://images.unsplash.com/photo-1580519542036-47d691377c82?w=1200',
                'link_url': '/products?category=kangra',
                'position': 3,
            },
        ]

        for banner_data in banners_data:
            Banner.objects.update_or_create(
                title=banner_data['title'],
                defaults={
                    **banner_data,
                    'is_active': True,
                    'start_date': timezone.now(),
                    'end_date': timezone.now() + timezone.timedelta(days=90),
                }
            )

    def create_coupons(self):
        coupons_data = [
            {
                'code': 'HIMACHAL20',
                'discount_type': 'percentage',
                'discount_value': 20,
                'min_order_amount': 500,
                'valid_from': timezone.now(),
                'valid_until': timezone.now() + timezone.timedelta(days=30),
                'usage_limit': 1000,
            },
            {
                'code': 'FRESH50',
                'discount_type': 'fixed',
                'discount_value': 50,
                'min_order_amount': 300,
                'valid_from': timezone.now(),
                'valid_until': timezone.now() + timezone.timedelta(days=60),
                'usage_limit': None,
            },
        ]

        for coupon_data in coupons_data:
            Coupon.objects.update_or_create(
                code=coupon_data['code'],
                defaults={
                    **coupon_data,
                    'is_active': True,
                }
            )