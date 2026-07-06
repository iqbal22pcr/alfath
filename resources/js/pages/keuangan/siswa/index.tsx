import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pembayaran Siswa', href: '/keuangan/siswa' }];

interface SiswaRow {
    id: number;
    nama_wali: string | null;
    status: 'calon' | 'aktif';
}

interface IndexProps {
    siswa: SiswaRow[];
}

export default function Index({ siswa }: IndexProps) {
    const { flash } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pembayaran Siswa" />

            <div className="flex flex-col gap-4 p-4">
                {flash.success && (
                    <div className="rounded-lg border border-border bg-background p-4 text-sm font-medium text-success">{flash.success}</div>
                )}

                <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">ID</th>
                                <th className="px-4 py-3 text-left font-medium">Wali Murid</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {siswa.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                        Belum ada siswa.
                                    </td>
                                </tr>
                            )}
                            {siswa.map((s) => (
                                <tr key={s.id} className="hover:bg-muted/50">
                                    <td className="px-4 py-3">{s.id}</td>
                                    <td className="px-4 py-3">Wali: {s.nama_wali ?? '(tidak diketahui)'}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={s.status === 'aktif' ? 'success' : 'secondary'}>{s.status}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Button asChild size="sm">
                                            <Link href={`/keuangan/siswa/${s.id}/tagihan`}>Lihat Tagihan</Link>
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
