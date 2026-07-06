import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Tahun Ajaran', href: '/admin/tahun-ajaran' }];

interface TahunAjaranRow {
    id: number;
    nama: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    aktif: boolean;
}

interface IndexProps {
    tahunAjaran: TahunAjaranRow[];
}

export default function Index({ tahunAjaran }: IndexProps) {
    const { flash } = usePage<SharedData>().props;

    function jadikanAktif(id: number) {
        router.patch(`/admin/tahun-ajaran/${id}/aktifkan`, {}, { preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tahun Ajaran" />

            <div className="flex flex-col gap-4 p-4">
                {flash.success && (
                    <div className="rounded-lg border border-border bg-background p-4 text-sm font-medium text-success">{flash.success}</div>
                )}

                <div className="flex justify-end">
                    <Button asChild size="sm">
                        <Link href="/admin/tahun-ajaran/create">Tambah Tahun Ajaran</Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Nama</th>
                                <th className="px-4 py-3 text-left font-medium">Tanggal Mulai</th>
                                <th className="px-4 py-3 text-left font-medium">Tanggal Selesai</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {tahunAjaran.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                        Belum ada tahun ajaran.
                                    </td>
                                </tr>
                            )}
                            {tahunAjaran.map((t) => (
                                <tr key={t.id} className="hover:bg-muted/50">
                                    <td className="px-4 py-3">{t.nama}</td>
                                    <td className="px-4 py-3">{t.tanggal_mulai}</td>
                                    <td className="px-4 py-3">{t.tanggal_selesai}</td>
                                    <td className="px-4 py-3">
                                        {t.aktif ? <Badge variant="success">Aktif</Badge> : <Badge variant="secondary">Tidak Aktif</Badge>}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {!t.aktif && (
                                            <Button size="sm" variant="success" onClick={() => jadikanAktif(t.id)}>
                                                Jadikan Aktif
                                            </Button>
                                        )}
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
