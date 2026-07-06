import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Status Pendaftaran PPDB', href: '/ppdb/status' }];

const labelDokumen: Record<string, string> = {
    akta_kelahiran: 'Akta Kelahiran',
    kartu_keluarga: 'Kartu Keluarga',
    ktp_orangtua: 'KTP Kedua Orang Tua',
    pas_foto: 'Pas Foto',
    surat_kematian_ayah: 'Surat Kematian Ayah',
    surat_kematian_tidak_mampu: 'Surat Keterangan Tidak Mampu',
};

const badgeVariantByStatus = {
    diajukan: 'secondary',
    diterima: 'success',
    ditolak: 'destructive',
} as const;

interface StatusProps {
    pendaftaran: {
        id: number;
        status: 'diajukan' | 'diterima' | 'ditolak';
        status_ayah: string;
        kondisi_ekonomi: string | null;
        punya_saudara_sekolah: boolean;
        nama_saudara: string | null;
        gelombang: string;
        dokumen: string[];
    };
}

export default function Status({ pendaftaran }: StatusProps) {
    const { flash } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Status Pendaftaran PPDB" />

            <div className="flex flex-col gap-4 p-4">
                {flash.success && (
                    <div className="rounded-lg border border-border bg-background p-4 text-sm font-medium text-success">{flash.success}</div>
                )}

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Pendaftaran #{pendaftaran.id}
                            <Badge variant={badgeVariantByStatus[pendaftaran.status]}>{pendaftaran.status}</Badge>
                        </CardTitle>
                        <CardDescription>{pendaftaran.gelombang}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 text-sm">
                        <div>
                            <span className="font-medium">Status Ayah:</span> {pendaftaran.status_ayah}
                        </div>
                        {pendaftaran.kondisi_ekonomi && (
                            <div>
                                <span className="font-medium">Kondisi Ekonomi:</span> {pendaftaran.kondisi_ekonomi}
                            </div>
                        )}
                        <div>
                            <span className="font-medium">Punya Saudara Bersekolah:</span> {pendaftaran.punya_saudara_sekolah ? 'Ya' : 'Tidak'}
                        </div>
                        {pendaftaran.punya_saudara_sekolah && pendaftaran.nama_saudara && (
                            <div>
                                <span className="font-medium">Nama Saudara:</span> {pendaftaran.nama_saudara}
                            </div>
                        )}
                        <div>
                            <span className="mb-1 block font-medium">Dokumen Terkirim:</span>
                            <ul className="list-inside list-disc">
                                {pendaftaran.dokumen.map((jenis) => (
                                    <li key={jenis}>{labelDokumen[jenis] ?? jenis}</li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
