import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tahun Ajaran', href: '/admin/tahun-ajaran' },
    { title: 'Tambah', href: '/admin/tahun-ajaran/create' },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/tahun-ajaran');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Tahun Ajaran" />

            <div className="p-4">
                <Card className="max-w-lg">
                    <CardHeader>
                        <CardTitle>Tambah Tahun Ajaran</CardTitle>
                        <CardDescription>Tahun ajaran baru dibuat tidak aktif — aktifkan lewat tombol "Jadikan Aktif" di daftar.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="nama">Nama</Label>
                                <Input
                                    id="nama"
                                    placeholder="mis. 2026/2027"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                />
                                {errors.nama && <p className="text-sm text-destructive">{errors.nama}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                                <Input
                                    id="tanggal_mulai"
                                    type="date"
                                    value={data.tanggal_mulai}
                                    onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                />
                                {errors.tanggal_mulai && <p className="text-sm text-destructive">{errors.tanggal_mulai}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                                <Input
                                    id="tanggal_selesai"
                                    type="date"
                                    value={data.tanggal_selesai}
                                    onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                />
                                {errors.tanggal_selesai && <p className="text-sm text-destructive">{errors.tanggal_selesai}</p>}
                            </div>

                            <Button type="submit" disabled={processing}>
                                Simpan
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
