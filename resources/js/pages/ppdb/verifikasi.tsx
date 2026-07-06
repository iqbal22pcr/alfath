import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface KategoriSiswaOption {
    id: number;
    nama: string;
}

interface PendaftaranDetail {
    id: number;
    gelombang: string;
    tanggal_daftar: string;
}

interface VerifikasiProps {
    pendaftaran: PendaftaranDetail;
    kategoriSiswa: KategoriSiswaOption[];
}

export default function Verifikasi({ pendaftaran, kategoriSiswa }: VerifikasiProps) {
    const { errors } = usePage<SharedData>().props;
    const [kategoriSiswaId, setKategoriSiswaId] = useState<string>('');
    const [processing, setProcessing] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Verifikasi Pendaftaran', href: '/ppdb/pendaftaran' },
        { title: `Pendaftaran #${pendaftaran.id}`, href: `/ppdb/pendaftaran/${pendaftaran.id}/verifikasi` },
    ];

    function submit(status: 'diterima' | 'ditolak') {
        setProcessing(true);
        router.patch(
            `/ppdb/pendaftaran/${pendaftaran.id}/verifikasi`,
            {
                status,
                kategori_siswa_id: status === 'diterima' ? kategoriSiswaId : null,
            },
            {
                onFinish: () => setProcessing(false),
            },
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Verifikasi Pendaftaran #${pendaftaran.id}`} />

            <div className="flex flex-col gap-4 p-4">
                <Card className="max-w-xl">
                    <CardHeader>
                        <CardTitle>Pendaftaran #{pendaftaran.id}</CardTitle>
                        <CardDescription>
                            {pendaftaran.gelombang} &middot; Daftar pada {pendaftaran.tanggal_daftar}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {errors.status && (
                            <Alert variant="destructive">
                                <AlertTitle>{errors.status}</AlertTitle>
                            </Alert>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="kategori_siswa_id">Kategori Siswa</Label>
                            <Select value={kategoriSiswaId} onValueChange={setKategoriSiswaId}>
                                <SelectTrigger id="kategori_siswa_id">
                                    <SelectValue placeholder="Pilih kategori (wajib jika diterima)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kategoriSiswa.map((k) => (
                                        <SelectItem key={k.id} value={String(k.id)}>
                                            {k.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.kategori_siswa_id && <p className="text-sm text-destructive">{errors.kategori_siswa_id}</p>}
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="destructive" disabled={processing} onClick={() => submit('ditolak')}>
                                Tolak Pendaftaran
                            </Button>
                            <Button type="button" variant="success" disabled={processing || !kategoriSiswaId} onClick={() => submit('diterima')}>
                                Terima Pendaftaran
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
