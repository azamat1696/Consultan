export default function DistanceSalesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Mesafeli Satış Sözleşmesi</h1>
        <p className="text-gray-600">Bu sözleşme, Dancomy platformu üzerinden gerçekleştirilen danışmanlık hizmetlerinin satışına ilişkin olarak, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince düzenlenmiştir.</p>
      </div>
      
      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Giriş</h2>
          <p className="text-gray-600">
            Bu mesafeli satış sözleşmesi ("Sözleşme"), Dancomy platformu üzerinden gerçekleştirilen 
            danışmanlık hizmetlerinin satışına ilişkin olarak, 6502 sayılı Tüketicinin Korunması 
            Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince düzenlenmiştir.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Taraflar</h2>
          <p className="text-gray-600">
            <strong>SATICI:</strong> Dancomy<br />
            <strong>ALICI:</strong> Platform üzerinden danışmanlık hizmeti satın alan gerçek veya tüzel kişi
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. Konu</h2>
          <p className="text-gray-600">
            Bu sözleşmenin konusu, ALICI'nın SATICI'ya ait web sitesinden elektronik ortamda 
            siparişini verdiği, konusu belirtilen danışmanlık hizmetinin satışı ve teslimi ile 
            ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler 
            Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">4. Sözleşme Konusu Hizmetin Fiyatı ve Ödeme Şekli</h2>
          <p className="text-gray-600 mb-4">
            Hizmetin toplam fiyatı, vergiler dahil olmak üzere sipariş formunda belirtilen fiyattır. 
            Fiyat, kargo ve teslimat ücreti dahil olmak üzere ALICI tarafından ödenecek toplam tutarı içerir.
          </p>
          <p className="text-gray-600 mb-4">
            ALICI, sipariş konusu hizmetin bedelini aşağıdaki ödeme yöntemlerinden biriyle ödeyebilir:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Kredi Kartı</li>
            <li>Banka Kartı</li>
            <li>Havale/EFT</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">5. Genel Hükümler</h2>
          <p className="text-gray-600 mb-4">
            ALICI, web sitesinde siparişini onaylamadan önce dilediği değişiklikleri yapabilir, 
            siparişini kontrol edebilir, düzeltebilir, teyit edebilir veya siparişten vazgeçebilir.
          </p>
          <p className="text-gray-600">
            Siparişin onaylanması, ALICI'nın bu sözleşmeyi okuduğunu ve kabul ettiğini gösterir.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">6. Cayma Hakkı</h2>
          <p className="text-gray-600 mb-4">
            ALICI, hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin, 
            mal satışına ilişkin işlemlerde teslimat tarihinden itibaren 14 (on dört) gün içerisinde 
            cayma hakkını kullanabilir.
          </p>
          <p className="text-gray-600">
            Cayma hakkının kullanılması için bu süre içinde SATICI'ya yazılı olarak veya dijital 
            ortamda başvurulması yeterlidir.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">7. Uyuşmazlıkların Çözümü</h2>
          <p className="text-gray-600">
            İstanbul Tüketici Hakem Heyeti, Tüketici Mahkemeleri ve Dava Değeri 14.000 TL'yi 
            aşmayan uyuşmazlıklarda Tüketici Hakem Heyetleri yetkilidir.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">8. Gizlilik</h2>
          <p className="text-gray-600">
            ALICI'nın kişisel verilerinin korunması amacıyla gerekli tüm teknik ve idari tedbirler 
            alınmıştır. ALICI'nın kişisel verileri, üçüncü kişilere kural olarak aktarılmaz.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">9. Yürürlük</h2>
          <p className="text-gray-600">
            Bu sözleşme, ALICI'nın siparişini onayladığı tarihte yürürlüğe girer. ALICI, 
            siparişini onaylamakla bu sözleşmenin tüm koşullarını kabul etmiş sayılır.
          </p>
        </section>
      </div>
    </div>
  );
}