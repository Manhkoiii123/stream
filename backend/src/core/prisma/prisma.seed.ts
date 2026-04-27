import { BadRequestException, Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { hash } from 'argon2'

const prisma = new PrismaClient()
async function main() {
	try {
		Logger.log('Seeding database...')
		await prisma.$transaction([
			prisma.user.deleteMany(),
			prisma.socialLink.deleteMany(),
			prisma.stream.deleteMany(),
			prisma.category.deleteMany()
		])
		const categoriesData = [
			{
				title: 'Just Chatting',
				slug: 'just-chatting',
				description:
					"Just Chatting is the go-to category for streamers who want to have real, unscripted conversations with their audience. Whether it's talking about daily life, current events, personal stories, or random topics, this space is all about genuine human connection. Viewers tune in to laugh, relate, and feel like they're hanging out with a friend.",
				thumbnailUrl:
					'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=300&fit=crop'
			},
			{
				title: 'Gaming',
				slug: 'gaming',
				description:
					"The Gaming category covers everything from AAA blockbusters to indie gems, speedruns to casual playthroughs. Watch skilled players tackle challenging content, explore open worlds, compete in ranked matches, or just have fun with the latest releases. Whether you're here to learn, spectate, or simply enjoy the ride, there's always something exciting happening.",
				thumbnailUrl:
					'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop'
			},
			{
				title: 'Music',
				slug: 'music',
				description:
					'The Music category is a live stage for artists, producers, and music enthusiasts from around the world. Tune in for live performances, DJ sets, beat-making sessions, singing practice, or instrument showcases. From lo-fi chill vibes to high-energy concerts, this is the place where music comes alive in real time.',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'
			},
			{
				title: 'Art & Creative',
				slug: 'art-and-creative',
				description:
					'Art & Creative is where imagination meets the screen. Watch talented creators paint, draw, sculpt, animate, design, and craft in real time. This category celebrates all forms of visual expression — from digital illustration and concept art to traditional oil painting and cosplay crafting. A perfect space for artists to share their process and inspire others.',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop'
			},
			{
				title: 'Sports',
				slug: 'sports',
				description:
					"The Sports category brings the passion of athletics to your screen. Watch live workouts, sports commentary, highlight breakdowns, fitness coaching sessions, and even real-time sports viewing parties. Whether you're a hardcore fan or a casual viewer, this is the hub for all things athletic — from traditional sports to emerging competitive scenes.",
				thumbnailUrl:
					'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop'
			},
			{
				title: 'Esports',
				slug: 'esports',
				description:
					'Esports is where competitive gaming reaches its peak. Follow your favorite teams and players compete in high-stakes tournaments across games like League of Legends, Valorant, CS2, Dota 2, and more. Experience the thrill of professional-level play, expert analysis, and live commentary that makes every match feel like a championship event.',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&h=300&fit=crop'
			},
			{
				title: 'Cooking & Food',
				slug: 'cooking-and-food',
				description:
					"Cooking & Food brings the kitchen to life with live meal prep, recipe tutorials, food reviews, and culinary experiments. Whether it's a seasoned chef crafting gourmet dishes or a home cook trying something new, this category satisfies your appetite for both great food and entertaining content. Discover new flavors, techniques, and food cultures from around the world.",
				thumbnailUrl:
					'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop'
			},
			{
				title: 'Travel & Outdoors',
				slug: 'travel-and-outdoors',
				description:
					"Travel & Outdoors is your window to the world. Join adventurers, hikers, backpackers, and explorers as they share breathtaking landscapes, cultural discoveries, city tours, and off-the-beaten-path experiences. Whether it's a solo trip through Southeast Asia or a camping expedition in the Rockies, this category brings the spirit of adventure directly to your screen.",
				thumbnailUrl:
					'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop'
			},
			{
				title: 'Technology',
				slug: 'technology',
				description:
					"The Technology category is a hub for developers, engineers, tech enthusiasts, and curious minds. Watch live coding sessions, hardware teardowns, software reviews, AI demonstrations, cybersecurity discussions, and tech news breakdowns. Whether you're learning a new programming language or keeping up with the latest in silicon, this is the place for all things tech.",
				thumbnailUrl:
					'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop'
			},
			{
				title: 'Education',
				slug: 'education',
				description:
					'Education streaming makes learning an interactive and engaging experience. From mathematics and science to history, philosophy, language learning, and self-improvement, this category connects knowledgeable streamers with curious viewers. Ask questions in real time, follow along with lessons, and expand your understanding of the world in a community-driven classroom setting.',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop'
			},
			{
				title: 'Minecraft',
				slug: 'minecraft',
				description:
					'Minecraft is a sandbox adventure game where creativity knows no bounds. Watch streamers survive, build, explore, and craft their way through infinite procedurally generated worlds. From hardcore survival challenges and massive architectural builds to redstone engineering and modded adventures, Minecraft streams offer something for every type of gamer.',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1607513746994-51f730a44832?w=400&h=300&fit=crop'
			},
			{
				title: 'Grand Theft Auto V',
				slug: 'grand-theft-auto-v',
				description:
					'Grand Theft Auto V is an open-world action game set in the sprawling city of Los Santos. Watch streamers complete the gripping story mode, pull off elaborate heists, dominate GTA Online, or just cause mayhem across the map. With endless freedom and a massive online world, GTA V streams are always entertaining and unpredictable.',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=400&h=300&fit=crop'
			},
			{
				title: 'Rust',
				slug: 'rust',
				description:
					"Rust is a brutal multiplayer survival game where players must gather resources, build bases, and fight off both wildlife and other players to stay alive. Watch streamers navigate intense PvP encounters, execute clever raid strategies, form alliances, and struggle to survive in one of gaming's most unforgiving environments.",
				thumbnailUrl:
					'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
			},
			{
				title: 'Cyberpunk 2077',
				slug: 'cyberpunk-2077',
				description:
					'Cyberpunk 2077 is an open-world RPG set in the dystopian Night City, where high technology and corruption collide. Watch streamers explore the neon-lit streets, take on story missions and side gigs, customize their character with cybernetic upgrades, and uncover the deep lore of a world ruled by megacorporations and street gangs alike.',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=300&fit=crop'
			}
		]

		await prisma.category.createMany({
			data: categoriesData,
			skipDuplicates: true
		})
		Logger.log('Database seeded successfully')
		const categories = await prisma.category.findMany()
		const categoriesBySlug = Object.fromEntries(
			categories.map((category) => [category.slug, category])
		)

		const streamTitles = {
			minecraft: [
				'Minecraft Survival from Scratch!',
				'Building Epic Structures in Minecraft',
				'Minecraft Secrets: The Adventure Begins!',
				'Creating a Farm in Minecraft',
				'Defeating the Ender Dragon!',
				'Exploring Minecraft Dungeons',
				'Potions and Enchantments in Minecraft',
				'Automating Resource Farming in Minecraft',
				'Fishing and Hunting in Minecraft: Loot Run',
				'Crafting Unique Items in Minecraft'
			],
			'grand-theft-auto-v': [
				'100% Completing GTA 5',
				'Races and Stunts in GTA Online',
				'GTA 5 Story Mode: Back in Action!',
				'Pulling Off Heists in GTA V',
				'Having Fun in Los Santos',
				'Discovering Secret Locations in GTA 5',
				'Playing The Contract Missions in GTA Online',
				'Taking on the Police in GTA 5'
			],
			rust: [
				'Raiding Bases in Rust',
				'Surviving the Wasteland: Rust',
				'Testing New Rust Mechanics!',
				'From Beginner to Pro in Rust',
				'PvP Battles in the World of Rust',
				'Planning Raids in Rust: Tactics and Strategies',
				'Traps and Defensive Structures in Rust',
				'Hunting for Rare Resources in Rust',
				'Exploring Massive Rust Maps',
				'Surviving in Harsh Rust Conditions'
			],
			'cyberpunk-2077': [
				'Exploring Night City in Cyberpunk 2077',
				'Completing Story Quests in Cyberpunk',
				'Modding and Customization in Cyberpunk',
				'Weapons and Hacks: Combat Tactics in Cyberpunk',
				'Agent Missions in the World of the Future',
				'Cybernetic Implants: Upgrading Your Character',
				'Uncovering Corporate Conspiracies',
				'Missions with High-Speed Cyberattacks',
				'Doing Side Quests in Cyberpunk 2077',
				'Review of Updates and DLCs'
			]
		}

		const avatarUrls = [
			'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
			'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop',
			'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
			'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
			'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
			'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop',
			'https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=150&h=150&fit=crop'
		]

		const streamThumbnails = [
			'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop',
			'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&h=450&fit=crop',
			'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop',
			'https://images.unsplash.com/photo-1619163153286-1b60d1ba6e75?w=800&h=450&fit=crop',
			'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&h=450&fit=crop',
			'https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?w=800&h=450&fit=crop',
			'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop',
			'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop',
			'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=450&fit=crop',
			'https://images.unsplash.com/photo-1636036955776-a4ebb1d7b3bc?w=800&h=450&fit=crop'
		]

		const usernames = [
			'shadowstrike',
			'neonrider',
			'frostbyte',
			'blazewing',
			'vortexhunter',
			'ironclad',
			'stormcaller',
			'darkpulse',
			'swiftarrow',
			'thunderwolf',
			'crimsonedge',
			'galaxybrain',
			'silentblade',
			'pixelknight',
			'auroraflame',
			'cyberphantom',
			'duskwalker',
			'zenithspark',
			'rampagex',
			'glitchwarden',
			'cobaltfury',
			'moonstriker',
			'ashenveil',
			'titanshift',
			'voidseeker',
			'emberlord',
			'frozenpeak',
			'nighshade',
			'solarflare99',
			'steelghost',
			'rocketjaw',
			'alphawave',
			'deadeyedex',
			'luckycharm',
			'ravenclaw7',
			'ironforge',
			'boltrunner',
			'spectreX',
			'wildthorn',
			'dungeonlord'
		]

		await prisma.$transaction(async (tx) => {
			const streamSlugs = Object.keys(streamTitles)
			for (const username of usernames) {
				const randomSlug =
					streamSlugs[Math.floor(Math.random() * streamSlugs.length)]
				const randomCategory = categoriesBySlug[randomSlug]

				const userExists = await tx.user.findUnique({
					where: { username }
				})
				if (!userExists) {
					const createdUser = await tx.user.create({
						data: {
							email: `${username}@gmail.com`,
							password: await hash('123456789'),
							username,
							displayName: username,
							avatar: avatarUrls[
								Math.floor(Math.random() * avatarUrls.length)
							],
							isEmailVerified: true,
							isDeactivated: false,
							socialLinks: {
								createMany: {
									data: [
										{
											title: 'Twitter',
											url: `https://twitter.com/${username}`,
											position: 1
										},
										{
											title: 'Instagram',
											url: `https://instagram.com/${username}`,
											position: 2
										}
									]
								}
							}
						}
					})
					const randomTitles = streamTitles[randomCategory.slug]
					const randomTitle =
						randomTitles[
							Math.floor(Math.random() * randomTitles.length)
						]

					await tx.stream.create({
						data: {
							title: randomTitle,
							thumbnailUrl:
								streamThumbnails[
									Math.floor(
										Math.random() * streamThumbnails.length
									)
								],
							user: {
								connect: { id: createdUser.id }
							},
							category: {
								connect: { id: randomCategory.id }
							}
						}
					})
					Logger.log(
						`Created user ${createdUser.username} with stream "${randomTitle}" in category "${randomCategory.title}"`
					)
				}
			}
		})
	} catch (error) {
		Logger.error('Error seeding database', error)
		throw new BadRequestException('Error seeding database')
	} finally {
		await prisma.$disconnect()
	}
}
main()
