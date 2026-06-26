import json
from clients import groq, GROQ_FAST

_SYSTEM = """\
Kamu adalah asisten yang membantu memastikan topik cukup jelas untuk dianalisis dari 6 perspektif berbeda.

Tugasmu: tentukan apakah topik yang diberikan cukup spesifik atau masih terlalu umum.

Topik yang CUKUP JELAS memiliki setidaknya:
- Subjek yang jelas (apa / siapa)
- Konteks atau situasi (di mana, kondisi apa)
- Tujuan atau keputusan yang ingin diambil

Contoh VAGUE: "bisnis online", "investasi", "karir", "ide usaha"
Contoh CLEAR: "Buka warung kopi di Jakarta Selatan dengan modal 50 juta, target mahasiswa"

Jika topik masih vague, buat pertanyaan klarifikasi beserta opsi jawaban.

Aturan membuat opsi:
- Jumlah opsi tidak harus sama untuk setiap pertanyaan — sesuaikan dengan kemungkinan yang realistis
- Jika kemungkinan jawaban terbatas dan jelas (ya/tidak, tipe A/B/C) → buat opsi tanpa "Lainnya"
- Jika kemungkinan jawaban luas tapi bisa dikelompokkan → buat beberapa opsi + tambahkan opsi terakhir: {"label": "Lainnya", "value": "other", "require_input": true}
- Opsi bisa berupa boolean, pilihan kategori, atau range nilai
- Jumlah pertanyaan sesuai kebutuhan — tidak ada batas minimum atau maksimum

Return JSON:
{
  "is_vague": true|false,
  "questions": [
    {
      "question": "teks pertanyaan",
      "options": [
        {"label": "teks opsi", "value": "nilai opsi"},
        {"label": "Lainnya", "value": "other", "require_input": true}
      ]
    }
  ],
  "refined_hint": "satu kalimat saran untuk membuat topik lebih spesifik — kosong jika sudah jelas"
}

Catatan:
- Jika is_vague false, questions harus array kosong []
- require_input hanya ada di opsi "Lainnya", tidak di opsi lain
- value harus lowercase tanpa spasi jika memungkinkan"""


async def clarify(topic: str) -> dict:
    resp = await groq.chat.completions.create(
        model=GROQ_FAST,
        messages=[
            {"role": "system", "content": _SYSTEM},
            {"role": "user", "content": f"Topik: {topic}"},
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
    )
    return json.loads(resp.choices[0].message.content)
