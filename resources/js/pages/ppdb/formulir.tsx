import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Formulir Pendaftaran PPDB', href: '/ppdb/formulir' }];

interface FormulirProps {
    gelombangTersedia: boolean;
}

interface FormulirData {
    status_ayah: 'hidup' | 'meninggal' | '';
    kondisi_ekonomi: string;
    punya_saudara_sekolah: boolean;
    nama_saudara: string;
    akta_kelahiran: File | null;
    kartu_keluarga: File | null;
    ktp_orangtua: File | null;
    pas_foto: File | null;
    surat_kematian_ayah: File | null;
    surat_kematian_tidak_mampu: File | null;
    [key: string]: string | boolean | File | null;
}

export default function Formulir({ gelombangTersedia }: FormulirProps) {
    const { data, setData, post, processing, errors } = useForm<FormulirData>({
        status_ayah: '',
        kondisi_ekonomi: '',
        punya_saudara_sekolah: false,
        nama_saudara: '',
        akta_kelahiran: null,
        kartu_keluarga: null,
        ktp_orangtua: null,
        pas_foto: null,
        surat_kematian_ayah: null,
        surat_kematian_tidak_mampu: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/ppdb/formulir');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Formulir Pendaftaran PPDB" />

            <div className="flex flex-col gap-4 p-4">
                {!gelombangTersedia ? (
                    <Alert variant="destructive">
                        <AlertTitle>Pendaftaran belum/tidak sedang dibuka saat ini. Silakan cek kembali nanti.</AlertTitle>
                    </Alert>
                ) : (
                    <Card className="max-w-2xl">
                        <CardHeader>
                            <CardTitle>Formulir Pendaftaran PPDB</CardTitle>
                            <CardDescription>Isi data berikut untuk mendaftarkan calon siswa baru.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {errors.gelombang && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertTitle>{errors.gelombang}</AlertTitle>
                                </Alert>
                            )}

                            <form onSubmit={submit} className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="status_ayah">Status Ayah</Label>
                                    <Select
                                        value={data.status_ayah}
                                        onValueChange={(value) => setData('status_ayah', value as 'hidup' | 'meninggal')}
                                    >
                                        <SelectTrigger id="status_ayah">
                                            <SelectValue placeholder="Pilih status ayah" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hidup">Hidup</SelectItem>
                                            <SelectItem value="meninggal">Meninggal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status_ayah && <p className="text-sm text-destructive">{errors.status_ayah}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="kondisi_ekonomi">Kondisi Ekonomi (opsional)</Label>
                                    <Textarea
                                        id="kondisi_ekonomi"
                                        placeholder="Jelaskan kondisi ekonomi keluarga bila relevan (mis. untuk kategori Kurang Mampu)"
                                        value={data.kondisi_ekonomi}
                                        onChange={(e) => setData('kondisi_ekonomi', e.target.value)}
                                    />
                                    {errors.kondisi_ekonomi && <p className="text-sm text-destructive">{errors.kondisi_ekonomi}</p>}
                                </div>

                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="punya_saudara_sekolah"
                                        checked={data.punya_saudara_sekolah}
                                        onCheckedChange={(checked) => setData('punya_saudara_sekolah', checked === true)}
                                    />
                                    <Label htmlFor="punya_saudara_sekolah">Punya saudara yang bersekolah/alumni di sini</Label>
                                </div>

                                {data.punya_saudara_sekolah && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="nama_saudara">Nama Saudara</Label>
                                        <Input
                                            id="nama_saudara"
                                            value={data.nama_saudara}
                                            onChange={(e) => setData('nama_saudara', e.target.value)}
                                        />
                                        {errors.nama_saudara && <p className="text-sm text-destructive">{errors.nama_saudara}</p>}
                                    </div>
                                )}

                                <div className="border-t border-border pt-4">
                                    <h3 className="mb-4 font-medium">Dokumen</h3>
                                    <div className="grid gap-4">
                                        <FileField
                                            id="akta_kelahiran"
                                            label="Akta Kelahiran"
                                            onChange={(file) => setData('akta_kelahiran', file)}
                                            error={errors.akta_kelahiran}
                                        />
                                        <FileField
                                            id="kartu_keluarga"
                                            label="Kartu Keluarga"
                                            onChange={(file) => setData('kartu_keluarga', file)}
                                            error={errors.kartu_keluarga}
                                        />
                                        <FileField
                                            id="ktp_orangtua"
                                            label="KTP Kedua Orang Tua"
                                            onChange={(file) => setData('ktp_orangtua', file)}
                                            error={errors.ktp_orangtua}
                                        />
                                        <FileField
                                            id="pas_foto"
                                            label="Pas Foto"
                                            onChange={(file) => setData('pas_foto', file)}
                                            error={errors.pas_foto}
                                        />

                                        {data.status_ayah === 'meninggal' && (
                                            <FileField
                                                id="surat_kematian_ayah"
                                                label="Surat Kematian Ayah"
                                                onChange={(file) => setData('surat_kematian_ayah', file)}
                                                error={errors.surat_kematian_ayah}
                                            />
                                        )}

                                        <FileField
                                            id="surat_kematian_tidak_mampu"
                                            label="Surat Keterangan Tidak Mampu (opsional)"
                                            onChange={(file) => setData('surat_kematian_tidak_mampu', file)}
                                            error={errors.surat_kematian_tidak_mampu}
                                        />
                                    </div>
                                </div>

                                <Button type="submit" disabled={processing}>
                                    Kirim Pendaftaran
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}

function FileField({
    id,
    label,
    onChange,
    error,
}: {
    id: string;
    label: string;
    onChange: (file: File | null) => void;
    error?: string;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
