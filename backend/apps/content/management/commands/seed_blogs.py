from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from apps.content.models import BlogCategory, BlogPost, BlogTag

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed blogs with Himachal Pradesh district stories'

    def handle(self, *args, **options):
        self.stdout.write('Creating Himachal blog content...')

        # Create admin user if not exists
        admin, created = User.objects.get_or_create(
            email='admin@himachalapples.com',
            defaults={
                'username': 'admin',
                'first_name': 'Admin',
                'last_name': 'User',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()

        self.create_tags()
        self.stdout.write(self.style.SUCCESS('✓ Tags created'))

        self.create_district_blogs()
        self.stdout.write(self.style.SUCCESS('✓ District blogs created'))

        self.create_other_blogs()
        self.stdout.write(self.style.SUCCESS('✓ Other blogs created'))

        self.stdout.write(self.style.SUCCESS('\n✅ Blog content seeded!'))

    def create_tags(self):
        tags_data = [
            {'name': 'Orchard Life', 'slug': 'orchard-life'},
            {'name': 'Local Farmers', 'slug': 'local-farmers'},
            {'name': 'Traditional Recipe', 'slug': 'traditional-recipe'},
            {'name': 'District Story', 'slug': 'district-story'},
            {'name': 'Seasonal', 'slug': 'seasonal'},
            {'name': 'Travel', 'slug': 'travel'},
            {'name': 'Culture', 'slug': 'culture'},
            {'name': 'Organic Farming', 'slug': 'organic-farming'},
        ]

        for tag_data in tags_data:
            BlogTag.objects.get_or_create(slug=tag_data['slug'], defaults=tag_data)

    def create_district_blogs(self):
        # Get or create admin user
        admin = User.objects.filter(is_staff=True).first()

        # Get tags
        story_tag = BlogTag.objects.filter(slug='district-story').first()
        farmer_tag = BlogTag.objects.filter(slug='local-farmers').first()
        orchard_tag = BlogTag.objects.filter(slug='orchard-life').first()

        blogs_data = [
            {
                'title': 'Kinnaur: The Land of Apples Where Every Orchard Has a Story',
                'slug': 'kinnaur-apple-orchards-story',
                'excerpt': '''Walking through Kinnaur's apple orchards in September, you understand why these apples taste different. 
                It's not just the soil or the altitude - it's the love of generations.''',
                'content': '''The moment you enter Kinnaur valley, the air changes. It feels cleaner, crisper, like nature itself 
                is taking a deep breath.

                I met 67-year-old Ghanshyam Negi in his orchard near Kalpa. His family has been growing apples here for four 
                generations. "My grandfather planted these trees," he says, touching a gnarled branch. "When I was a boy, 
                my father taught me that the apple tree is like a family member. You don't just harvest it, you take care of it."

                The apples from Kinnaur are different. The Royal Delicious here have that signature sweetness that no 
                other region's apples seem to match. Scientists say it's the altitude - over 10,000 feet. But Ghanshyam 
                uncle says it's simpler: "We don't rush the fruit. Let it ripen on the tree, not in some cold store."

                What touched me most was his concern for the younger generation. "My son works in Delhi now. He earns well, 
                but sometimes he calls and says 'Papa, I miss the orchard.' I tell him, the land will always be here. 
                When you're ready, come back."

                The apples of Kinnaur aren't just fruit - they're a connection to a way of life that's slowly changing 
                but never disappearing.''',
                'category': 'apples',
                'tags': [story_tag, farmer_tag, orchard_tag],
            },
            {
                'title': 'Shimla: The OG Apple District and the Families Behind It',
                'slug': 'shimla-apple-heritage',
                'excerpt': '''The story of Himachal apples really begins in Shimla. Before Kinnaur became famous, it was the 
                orchards around Shimla that fed the nation its apples.''',
                'content': '''Every October, when the apple season peaks, the roads around Shimla transform. Trucks lined up 
                to carry boxes of apples, families working together to pick, sort, pack.

                The Rao family from Chopal has been in apples for 50 years. "My father started with just 20 trees," 
                remembers Rajesh Rao. "Now we have 500. But the way we grow them? Still the same."

                What makes Shimla apples special is the legacy. When you buy an apple from here, you're tasting 
                half a century of experience. The Rao family knows every tree in their orchard by name. "This one 
                gives big apples but less quantity. That one gives smaller but sweeter."

                The changing climate has been challenging. "Summers are hotter now. We have to water more," explains 
                Rajesh. "But we won't use machines to speed things up. That affects the taste."

                Today, Rajesh's daughter Priya is learning the business. She's bringing new ideas - better packaging, 
                direct customer connections. "My father taught me about the land. Now I'm learning to connect it 
                to the world."''',
                'category': 'apples',
                'tags': [story_tag, farmer_tag],
            },
            {
                'title': 'Kullu-Manali: Beyond Tourism - The Valley That Grows Gold',
                'slug': 'kullu-apple-valley',
                'excerpt': '''Beyond the tourist crowds and the Beas river lies another Kullu - one of apple orchards 
                stretching up the hillsides, waiting to be discovered.''',
                'content': '''Most people come to Kullu-Manali for the mountains and the rafting. They miss the real 
                treasure - the apple orchards that cascade down the hillsides.

                The best apples here grow above the main town, in villages like Naggar and Vashist. Local farmer 
                Deep Chand tells me his Golden Delicious are special because "the morning fog here stays until 
                noon. The apple ripens slowly, takes its time."

                What I love about Kullu farmers is their simplicity. Deep Chand invited me for lunch - simple 
                pahadi dal, rice, and fresh apples from his tree. "Eat," he insisted. "That's how you know 
                our apples - taste them here, where they grow."

                The Kullu apples have a unique sweetness - almost honey-like. It's hard to explain to someone 
                who hasn't tasted it. You have to come here, eat one right off the tree, to understand.

                For tourists, I always say: take a day off from the Mall Road. Hire a local guide. Walk into 
                the orchards. Meet the farmers. That's the real Kullu.''',
                'category': 'apples',
                'tags': [story_tag, farmer_tag, orchard_tag],
            },
            {
                'title': 'Chamba: The Forgotten Apple Valley That Still Surprises',
                'slug': 'chamba-apple-gems',
                'excerpt': '''Chamba is often skipped by tourists rushing to Manali. But this valley produces some 
                of Himachal's most underrated apples - and the sweetest walnuts.''',
                'content': '''Chamba remains Himachal's best-kept secret. While everyone fights over apples from Shimla 
                and Kinnaur, Chamba quietly produces some of the finest.

                The journey to Chamba is an adventure in itself. Winding roads through deep valleys, occasional 
                glimpses of snow-capped peaks. But the reward? Orchards that feel untouched by time.

                Mohan Lal has been growing apples here for 40 years. His orchard is small - just 100 trees. 
                "Big farmers have machines," he says. "I have time. I check every tree, every apple."

                His apples don't look as perfect as the ones in supermarket - some have marks, a few are 
                crooked. But taste one, and you'll understand. The flavor is intense, the flesh crisp, 
                the sweetness deep.

                "People from cities come and say bhai, these apples look different," Mohan Lal laughs. 
                "I tell them, that's because they grew in real mountain soil, not in some factory."''',
                'category': 'apples',
                'tags': [story_tag, farmer_tag],
            },
            {
                'title': 'Kangra: Where Art and Agriculture Meet',
                'slug': 'kangra-craft-tradition',
                'excerpt': '''Kangra is famous for its temples and the legendary Kangra fort. But it's also home 
                to artisans keeping ancient crafts alive.''',
                'content': '''In Kangra, every object tells a story. The wooden boxes carved by local artisans, 
                the Kangra paintings that depict rural life, the traditional shawls - all carry centuries 
                of heritage.

                I visited a small workshop in Baijnath where artisans make the famous Kangra wooden boxes. 
                "My father learned from his father," explains 45-year-old Ramesh. "I teach my children now. 
                This is our family's story, written in wood."

                What makes Kangra special is how agriculture and art intersect. The same valley that grows 
                excellent vegetables also produces master craftsmen.

                When you buy a Kangra product, you're not just buying an object. You're keeping a tradition 
                alive. You're saying to these artisans: your craft matters, keep going.

                For visitors, I recommend the Baijnath temple complex on a Sunday morning. Watch the 
                artisans at work, talk to them, learn their stories. That's the real Kangra.''',
                'category': 'kangra',
                'tags': [story_tag, 'culture'],
            },
            {
                'title': 'Dharamshala: The Buddhist Connection and the Tea Gardens',
                'slug': 'dharamshala-tea-story',
                'excerpt': '''Dharamshala is known worldwide as the home of the Dalai Lama. But there's another 
                story here - the story of Kangra tea, once famous across India.''',
                'content': '''The tea gardens of Dharamshala have a fascinating history. In the 19th century, 
                British entrepreneurs started tea cultivation here, and for decades, "Kangra tea" was a 
                name synonymous with quality.

                Today, only fragments of that legacy remain. But a new generation is working to revive it.

                "Our grandparents used to drink this tea every morning," says Tenzin, a young farmer. 
                "Now I'm growing it again. The soil is still good, the climate is still perfect."

                The tea here is different from Darjeeling or Assam. It's lighter, more aromatic, with 
                a subtle sweetness. The local variety - called Kangra tea - has unique characteristics 
                that can't be replicated anywhere else.

                When you sip this tea, you're tasting history. You're being part of a revival story.''',
                'category': 'spices',
                'tags': [story_tag, 'culture', 'organic-farming'],
            },
        ]

        # Create category
        category, _ = BlogCategory.objects.get_or_create(
            slug='district-stories',
            defaults={
                'name': 'District Stories',
                'description': 'Stories from every corner of Himachal Pradesh'
            }
        )

        for blog_data in blogs_data:
            # Get category by slug
            cat = BlogCategory.objects.filter(slug=blog_data.pop('category')).first()
            
            # Get tags
            tags = blog_data.pop('tags', [])
            
            post, created = BlogPost.objects.get_or_create(
                slug=blog_data['slug'],
                defaults={
                    **blog_data,
                    'author': admin,
                    'category': cat,
                    'status': 'published',
                    'published_at': timezone.now(),
                }
            )
            
            if created and tags:
                post.tags.set(tags)

    def create_other_blogs(self):
        admin = User.objects.filter(is_staff=True).first()
        
        other_blogs = [
            {
                'title': 'The Apple Picker\'s Morning - A Photo Story',
                'slug': 'apple-picker-morning',
                'excerpt': '''An early morning in an apple orchard, before the sun peaks over the mountains. 
                This is when the real work happens.''',
                'content': '''The alarm rings at 4 AM. Not for tourists, but for the apple pickers.

                By 5 AM, they're already in the orchard. The morning air is cold, sometimes freezing. 
                But the apples need to be picked while they're still cool - that's when they're freshest.

                I spent a day with a picking team in Kinnaur. Their hands move fast, expert, precise. 
                Each apple is checked, gently placed in the crate. No throwing, no dropping.

                "Apple is like a child," says picker Ram Singh. "Handle with care or it bruises."

                By noon, the crates are full. The picker carries them down steep paths to the collection 
                point. Sometimes a km or more, on narrow mountain trails.

                The next time you bite into an apple, think of these hands. Think of this morning. 
                That's the real price of every fruit.''',
                'category': 'orchard-life',
                'tags': ['orchard-life', 'local-farmers'],
            },
            {
                'title': 'Traditional Apple Preserving - Grandma\'s Recipe',
                'slug': 'traditional-apple-preserve',
                'excerpt': '''In every Himachali home, there's a preserve recipe that's been passed down. 
                Here's one from a grandmother in Shimla hills.''',
                'content': '''"The secret is the apples," says 75-year-old Shanti Devi from Kotgarh. 
                "Use only ripe ones, never the green."

                Her apple jam is legendary in the family. Children who grew up and moved to Delhi, 
                Chandigarh, Mumbai - they all call every harvest season asking for "dadi ki jam."

                The recipe is simple: apples, sugar, a little lemon. No preservatives, no additives. 
                "My mother taught me, her mother taught her," Shanti Devi says. "Now my daughter 
                knows. And her daughters will know too."

                The cooking happens in a copper vessel - not stainless steel. "Copper keeps the 
                temperature even. The jam doesn't burn." Three hours of slow cooking, stirring 
                constantly.

                When it's done, the jam has a deep amber color. The taste? You can't buy this in 
                any store. You can only get it from someone who loves you enough to make it.''',
                'category': 'recipes',
                'tags': ['traditional-recipe', 'culture'],
            },
            {
                'title': 'Why Organic Matters - A Farmer\'s Perspective',
                'slug': 'organic-farmer-perspective',
                'excerpt': '''After 30 years of farming, here's what one Himachali farmer has learned 
                about organic versus chemical cultivation.''',
                'content': '''"In 1990, I started using chemical fertilizers," recalls Karam Chand from 
                Chopal. "The results were immediate - more apples, bigger size. But something was 
                changing."

                "After five years, I noticed the soil was dying. The earthworms were gone. The water 
                didn't taste right. And the apples? They looked perfect but had no taste."

                Karam Chand switched to organic in 2000. "The first two years were hard. Production 
                dropped. Neighbors laughed. But I stayed with it."

                "Today, my orchard is alive again. Earthworms, beetles, even small birds have returned. 
                And the apples? People taste them and say, this is different. This has the old taste."

                His advice to farmers: "Don't chase quick results. The land is not a machine. It's 
                a living thing. Treat it well, and it will feed you forever."

                His message to consumers: "Pay a fair price for organic. You're not just buying 
                apples - you're supporting a way of farming that will keep the mountains alive."''',
                'category': 'organic',
                'tags': ['organic-farming', 'local-farmers'],
            },
        ]

        # Create category
        cat, _ = BlogCategory.objects.get_or_create(
            slug='farm-life',
            defaults={
                'name': 'Farm Life',
                'description': 'Stories from Himachal farms'
            }
        )

        for blog_data in other_blogs:
            cat = BlogCategory.objects.filter(slug=blog_data.pop('category')).first() or cat
            tags = blog_data.pop('tags', [])
            
            post, created = BlogPost.objects.get_or_create(
                slug=blog_data['slug'],
                defaults={
                    **blog_data,
                    'author': admin,
                    'category': cat,
                    'status': 'published',
                    'published_at': timezone.now(),
                }
            )
            
            if created and tags:
                tag_objs = [t for t in BlogTag.objects.all() if t.slug in tags]
                post.tags.set(tag_objs)