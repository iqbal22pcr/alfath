import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type JenisBiaya = 'spp' | 'uang_masuk_pembangunan' | 'seragam' | 'buku';

interface TagihanRow {
    id: number;
    jenis_biaya: JenisBiaya;
    nominal: number;
    total_dibayar: number;
    sisa: number;
}

interface SiswaDetail {
    id: number;
    nama_wali: string | null;
    status: 'calon' | 'aktif';
}

interface TagihanPageProps {
    siswa: SiswaDetail;
    tagihan: TagihanRow[];
}

const labelJenisBiaya: Record<JenisBiaya, string> = {
    spp: 'SPP',
    uang_masuk_pembangunan: 'Uang Masuk/Pembangunan',
    seragam: 'Seragam',
    buku: 'Buku',
};

function formatRupiah(value: number): string {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

export default function Tagihan({ siswa, tagihan }: TagihanPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Pembayaran Siswa', href: '/keuangan/siswa' },
        { title: `Siswa #${siswa.id}`, href: `/keuangan/siswa/${siswa.id}/tagihan` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Tagihan Siswa #${siswa.id}`} />

            <div className="flex flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Siswa #{siswa.id}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                            <span>Wali: {siswa.nama_wali ?? '(tidak diketahui)'}</span>
                            <Badge variant={siswa.status === 'aktif' ? 'success' : 'secondary'}>{siswa.status}</Badge>
                        </CardDescription>
                    </CardHeader>
                </Card>

                <div className="flex flex-col gap-4">
                    {tagihan.map((t) => (
                        <TagihanCard key={t.id} tagihan={t} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}

function TagihanCard({ tagihan }: { tagihan: TagihanRow }) {
    // Seragam & Buku: harus lunas sekali input, tidak boleh dicicil (aturan
    // server). SPP diperlakukan sama seperti Uang Masuk/Pembangunan (boleh
    // parsial) — ini asumsi, belum ada aturan eksplisit soal SPP.
    const bolehCicil = tagihan.jenis_biaya === 'uang_masuk_pembangunan' || tagihan.jenis_biaya === 'spp';
    const lunas = tagihan.sisa <= 0;

    const { data, setData, post, processing, errors, reset } = useForm({
        nominal_dibayar: bolehCicil ? '' : String(tagihan.sisa),
        tanggal_bayar: new Date().toISOString().slice(0, 10),
        metode: 'tunai' as 'tunai' | 'transfer',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/keuangan/tagihan/${tagihan.id}/pembayaran`, {
            preserveScroll: true,
            onSuccess: () => reset('nominal_dibayar'),
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">{labelJenisBiaya[tagihan.jenis_biaya]}</CardTitle>
                <CardDescription>
                    Nominal: {formatRupiah(tagihan.nominal)} &middot; Sudah dibayar: {formatRupiah(tagihan.total_dibayar)} &middot; Sisa:{' '}
                    {formatRupiah(tagihan.sisa)}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {lunas ? (
                    <Badge variant="success">Lunas</Badge>
                ) : (
                    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-4 sm:items-end">
                        <div className="grid gap-2">
                            <Label htmlFor={`nominal-${tagihan.id}`}>Nominal Dibayar</Label>
                            <Input
                                id={`nominal-${tagihan.id}`}
                                type="number"
                                min="0.01"
                                step="0.01"
                                readOnly={!bolehCicil}
                                value={data.nominal_dibayar}
                                onChange={(e) => setData('nominal_dibayar', e.target.value)}
                            />
                            {errors.nominal_dibayar && <p className="text-sm text-destructive">{errors.nominal_dibayar}</p>}
                            {!bolehCicil && <p className="text-xs text-muted-foreground">Harus dibayar penuh, tidak bisa dicicil.</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor={`tanggal-${tagihan.id}`}>Tanggal Bayar</Label>
                            <Input
                                id={`tanggal-${tagihan.id}`}
                                type="date"
                                value={data.tanggal_bayar}
                                onChange={(e) => setData('tanggal_bayar', e.target.value)}
                            />
                            {errors.tanggal_bayar && <p className="text-sm text-destructive">{errors.tanggal_bayar}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor={`metode-${tagihan.id}`}>Metode</Label>
                            <Select value={data.metode} onValueChange={(value) => setData('metode', value as 'tunai' | 'transfer')}>
                                <SelectTrigger id={`metode-${tagihan.id}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tunai">Tunai</SelectItem>
                                    <SelectItem value="transfer">Transfer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" disabled={processing}>
                            Catat Pembayaran
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
