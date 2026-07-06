import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, HeartHandshake, Mail, MapPin, Phone, Sparkles } from 'lucide-react';

const keunggulan = [
    {
        icon: BookOpen,
        title: 'Kurikulum Terpadu',
        description: 'Memadukan kurikulum nasional dengan nilai-nilai keislaman dalam setiap kegiatan belajar.',
    },
    {
        icon: HeartHandshake,
        title: 'Lingkungan Islami',
        description: 'Membentuk karakter siswa melalui pembiasaan akhlak dan ibadah sehari-hari.',
    },
    {
        icon: Sparkles,
        title: 'Fasilitas Memadai',
        description: 'Ruang kelas, perpustakaan, dan sarana penunjang belajar yang nyaman dan aman.',
    },
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="SDIT Al-Fath Pekanbaru" />

            <div className="flex min-h-screen flex-col bg-background text-foreground">
                <header className="border-b">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-2 font-semibold">
                            <img src="/images/logo-alfath.jpg" alt="Logo SDIT Al-Fath" className="size-8 rounded-md object-cover" />
                            <span>SDIT Al-Fath Pekanbaru</span>
                        </div>
                        <nav className="flex items-center gap-3">
                            {auth.user ? (
                                <Button asChild size="sm">
                                    <Link href={route('dashboard')}>Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href={route('login')}>Masuk</Link>
                                    </Button>
                                    <Button asChild size="sm">
                                        <Link href={route('register')}>Daftar</Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="flex-1">
                    <section className="mx-auto max-w-6xl px-6 py-20 text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Selamat Datang di SDIT Al-Fath Pekanbaru</h1>
                        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                            Sekolah Dasar Islam Terpadu yang membina generasi cerdas, mandiri, dan berakhlak mulia.
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                            <Button asChild size="lg">
                                <Link href={route('register')}>Daftar PPDB</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href={route('login')}>Masuk Akun</Link>
                            </Button>
                        </div>
                    </section>

                    <section className="mx-auto max-w-6xl px-6 py-16">
                        <h2 className="mb-8 text-center text-2xl font-semibold">Kenapa Memilih Kami</h2>
                        <div className="grid gap-6 sm:grid-cols-3">
                            {keunggulan.map(({ icon: ItemIcon, title, description }) => (
                                <Card key={title}>
                                    <CardHeader>
                                        <ItemIcon className="mb-2 size-8 text-primary" />
                                        <CardTitle className="text-lg">{title}</CardTitle>
                                        <CardDescription>{description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section className="mx-auto max-w-6xl px-6 py-16">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hubungi Kami</CardTitle>
                                <CardDescription>Informasi kontak dan lokasi sekolah</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-3">
                                <div className="flex items-center gap-3">
                                    <MapPin className="size-5 shrink-0 text-muted-foreground" />
                                    <span className="text-sm">Pekanbaru, Riau</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="size-5 shrink-0 text-muted-foreground" />
                                    <span className="text-sm">(0761) 000-000</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="size-5 shrink-0 text-muted-foreground" />
                                    <span className="text-sm">info@alfath.sch.id</span>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </main>

                <footer className="border-t py-6 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} SDIT Al-Fath Pekanbaru
                </footer>
            </div>
        </>
    );
}
