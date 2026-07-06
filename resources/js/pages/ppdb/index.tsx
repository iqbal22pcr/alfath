import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Info } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Verifikasi Pendaftaran', href: '/ppdb/pendaftaran' }];

interface PendaftaranRow {
    id: number;
    gelombang: string;
    tanggal_daftar: string;
}

interface IndexProps {
    pendaftaran: PendaftaranRow[];
}

export default function Index({ pendaftaran }: IndexProps) {
    const { flash } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Verifikasi Pendaftaran PPDB" />

            <div className="flex flex-col gap-4 p-4">
                {flash.success && (
                    <Alert>
                        <AlertTitle>{flash.success}</AlertTitle>
                    </Alert>
                )}

                {flash.kuotaAlert && (
                    <Alert variant="accent">
                        <Info />
                        <AlertTitle>Info Kuota Kategori: {flash.kuotaAlert.kategori}</AlertTitle>
                        <AlertDescription>
                            Kuota kategori ini: {flash.kuotaAlert.kuota ?? 'belum diatur'}. Sudah aktif: {flash.kuotaAlert.aktif}. Calon (belum lunas
                            Seragam/Buku): {flash.kuotaAlert.calon}.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">ID</th>
                                <th className="px-4 py-3 text-left font-medium">Gelombang</th>
                                <th className="px-4 py-3 text-left font-medium">Tanggal Daftar</th>
                                <th className="px-4 py-3 text-right font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {pendaftaran.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                        Tidak ada pendaftaran yang menunggu verifikasi.
                                    </td>
                                </tr>
                            )}
                            {pendaftaran.map((p) => (
                                <tr key={p.id} className="hover:bg-muted/50">
                                    <td className="px-4 py-3">{p.id}</td>
                                    <td className="px-4 py-3">{p.gelombang}</td>
                                    <td className="px-4 py-3">{p.tanggal_daftar}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Button asChild size="sm">
                                            <Link href={`/ppdb/pendaftaran/${p.id}/verifikasi`}>Verifikasi</Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
