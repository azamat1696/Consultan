"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface BlogPost {
    id: string
    title: string
    excerpt: string
    image: string
    date: string
    readMoreUrl: string
}

const BlogCard = ({ post }: { post: BlogPost }) => {
    return (
        <Card className="h-full hover:shadow-md transition-shadow">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-lg">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <CardContent className="p-4">
                <h3 className="text-lg font-semibold line-clamp-2 mb-2">
                    {post.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <Link
                        href={post.readMoreUrl}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        Okumaya Devam Et
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export default function BlogSection() {
    const blogPosts: BlogPost[] = [
        {
            id: "1",
            title: "Babaların Kız Çocuklarının Gelişimine Etkisi",
            excerpt: "Babalar çocukların güvenli bir bağlanma modeli geliştirmesine yardımcı...",
            image: "/blog/father-daughter.jpg",
            date: "07 Ocak 2025",
            readMoreUrl: "/blog/babalarin-kiz-cocuklarinin-gelisimine-etkisi"
        },
        {
            id: "2",
            title: "❤️ Atatürk Günümüz Türkiye'sinde Yaşasaydı? 👇",
            excerpt: "Ulu Önderimiz Mustafa...",
            image: "/blog/ataturk.jpg",
            date: "07 Ocak 2025",
            readMoreUrl: "/blog/ataturk-gunumuz-turkiyesinde-yasasaydi"
        },
        {
            id: "3",
            title: "📢 Yapay Zeka (AI) Kullanım Oranı ve Yayılımı 🚀",
            excerpt: "Yapay zeka teknolojilerinin günümüzdeki kullanım oranları ve gelecek projeksiyonları...",
            image: "/blog/ai-stats.jpg",
            date: "07 Ocak 2025",
            readMoreUrl: "/blog/yapay-zeka-kullanim-orani"
        },
        {
            id: "4",
            title: "💥 Basitçe Yapay Zeka Evreni ‼️ 👇",
            excerpt: "Yapay zeka teknolojilerinin temel kavramları ve uygulama alanları...",
            image: "/blog/ai-universe.jpg",
            date: "07 Ocak 2025",
            readMoreUrl: "/blog/basitce-yapay-zeka-evreni"
        },
        {
            id: "5",
            title: "Öfke İle İlgili Yanlış Bilinenler",
            excerpt: "Öfke kelimesi aklımıza geldiğinde, genellikle çoğumuzda olumsuz bir...",
            image: "/blog/anger-misconceptions.jpg",
            date: "07 Ocak 2025",
            readMoreUrl: "/blog/ofke-ile-ilgili-yanlis-bilinenler"
        },
        {
            id: "6",
            title: "Öfke nedir? Öfke yönetimine giriş",
            excerpt: "Öfke diğer tüm duyg...",
            image: "/blog/anger-management.jpg",
            date: "07 Ocak 2025",
            readMoreUrl: "/blog/ofke-nedir-ofke-yonetimine-giris"
        }
    ]

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Blog</h2>
                    <p className="text-gray-600">
                        Danışmanlarımızın blog içeriklerini burada görebilirsiniz.
                    </p>
                </div>

                {/* Kategori Filtreleme */}
                <div className="flex overflow-x-auto gap-4 mb-8 pb-4 scrollbar-hide">
                    <button className="whitespace-nowrap px-4 py-2 rounded-full bg-blue-600 text-white">
                        Tüm Kategoriler
                    </button>
                    <button className="whitespace-nowrap px-4 py-2 rounded-full bg-white border hover:bg-gray-50">
                        Psikoloji
                    </button>
                    <button className="whitespace-nowrap px-4 py-2 rounded-full bg-white border hover:bg-gray-50">
                        Kişisel Gelişim
                    </button>
                    <button className="whitespace-nowrap px-4 py-2 rounded-full bg-white border hover:bg-gray-50">
                        Aile & Çocuk
                    </button>
                    <button className="whitespace-nowrap px-4 py-2 rounded-full bg-white border hover:bg-gray-50">
                        Teknoloji
                    </button>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogPosts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-12 flex justify-center gap-2">
                    <button className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-gray-50">
                        ←
                    </button>
                    <button className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                        1
                    </button>
                    <button className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-gray-50">
                        2
                    </button>
                    <button className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-gray-50">
                        3
                    </button>
                    <button className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-gray-50">
                        →
                    </button>
                </div>
            </div>
        </section>
    )
}
