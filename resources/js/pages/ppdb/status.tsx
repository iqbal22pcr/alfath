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

const badgeVariantBySiswaStatus = {
    calon: 'accent',
    aktif: 'success',
} as const;

type JenisBiaya = 'spp' | 'uang_masuk_pembangunan' | 'seragam' | 'buku';

const labelJenisBiaya: Record<JenisBiaya, string> = {
    spp: 'SPP',
    uang_masuk_pembangunan: 'Uang Masuk/Pembangunan',
    seragam: 'Seragam',
    buku: 'Buku',
};

function formatRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

interface Pembayaran {
    id: number;
    tanggal_bayar: string;
    nominal_dibayar: number;
    metode: 'tunai' | 'transfer';
}

interface TagihanItem {
    id: number;
    jenis_biaya: JenisBiaya;
    nominal: number;
    total_dibayar: number;
    sisa: number;
    pembayaran: Pembayaran[];
}

interface SiswaData {
    status: 'calon' | 'aktif';
    tagihan: TagihanItem[];
}

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
    siswa: SiswaData | null;
}

export default function Status({ pendaftaran, siswa }: StatusProps) {
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

                {siswa && (
                    <Card className="max-w-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                Data Siswa
                                <Badge variant={badgeVariantBySiswaStatus[siswa.status]}>{siswa.status}</Badge>
                            </CardTitle>
                            <CardDescription>Tagihan &amp; riwayat pembayaran (hanya lihat — pencatatan pembayaran dilakukan oleh staf keuangan).</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {siswa.tagihan.map((t) => (
                                <div key={t.id} className="rounded-lg border border-border p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="font-medium">{labelJenisBiaya[t.jenis_biaya]}</span>
                                        {t.sisa <= 0 ? <Badge variant="success">Lunas</Badge> : <Badge variant="secondary">Belum Lunas</Badge>}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Nominal: {formatRupiah(t.nominal)} &middot; Sudah dibayar: {formatRupiah(t.total_dibayar)} &middot; Sisa:{' '}
                                        {formatRupiah(t.sisa)}
                                    </p>

                                    {t.pembayaran.length > 0 && (
                                        <div className="mt-3 overflow-hidden rounded-md border border-border">
                                            <table className="w-full text-sm">
                                                <thead className="bg-muted text-muted-foreground">
                                                    <tr>
                                                        <th className="px-3 py-2 text-left font-medium">Tanggal Bayar</th>
                                                        <th className="px-3 py-2 text-left font-medium">Nominal</th>
                                                        <th className="px-3 py-2 text-left font-medium">Metode</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border">
                                                    {t.pembayaran.map((p) => (
                                                        <tr key={p.id}>
                                                            <td className="px-3 py-2">{p.tanggal_bayar}</td>
                                                            <td className="px-3 py-2">{formatRupiah(p.nominal_dibayar)}</td>
                                                            <td className="px-3 py-2 capitalize">{p.metode}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
