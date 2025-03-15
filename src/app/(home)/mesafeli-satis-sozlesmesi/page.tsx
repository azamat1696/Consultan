import React from 'react';

export default function DistanceSalesAgreementPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <section className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">MESAFELİ SATIŞ SÖZLEŞMESİ</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Madde 1: Taraflar</h2>
              <p className="text-gray-600 mb-4">
                İşbu sözleşme, Dancomy.com ile platformda sunulan hizmetlerden yararlanmak isteyen kullanıcılar (bundan sonra "Alıcı" olarak anılacaktır) arasında elektronik ortamda akdedilmiştir.
              </p>
              <p className="text-gray-600">
                Satıcı: Dancomy.com<br />
                Alıcı: Platform üzerinden hizmet satın alan kullanıcı
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Madde 2: Konu</h2>
              <p className="text-gray-600 mb-4">
                Bu sözleşme, Dancomy.com üzerinden satın alınan hizmetlerin satışı, ifası, ödeme koşulları ve tarafların hak ve yükümlülüklerini düzenlemektedir.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Platform üzerinden sunulan danışmanlık hizmetleri</li>
                <li>Online görüşme ve mesajlaşma hizmetleri</li>
                <li>Diğer profesyonel hizmetler</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Madde 3: Satış ve Ödeme Koşulları</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Kullanıcılar, uzmanlar tarafından belirlenen hizmet bedellerini platform aracılığıyla öder.</li>
                <li>Dancomy.com, satış işlemlerinde aracıdır ve tahsil edilen ücretin %40'ını hizmet komisyonu olarak alır.</li>
                <li>Ödeme işlemi tamamlandıktan sonra uzman, hizmeti sağlamakla yükümlüdür.</li>
                <li>Ödemeler, platform tarafından desteklenen güvenli ödeme yöntemleri ile yapılır.</li>
                <li>Fatura bilgileri, ödeme sonrasında kullanıcının kayıtlı e-posta adresine gönderilir.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Madde 4: Cayma Hakkı ve İptaller</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Kullanıcılar, hizmeti satın aldıktan 24 saat içinde iade talebinde bulunabilir.</li>
                <li>Uzmanın sunduğu hizmetten memnun kalmayan kullanıcılar, şikayetlerini destek@dancomy.com adresine iletmelidir.</li>
                <li>İade talepleri, hizmetin başlamamış olması durumunda geçerlidir.</li>
                <li>Başlamış hizmetler için kısmi iade yapılabilir.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Madde 5: Hizmet Şartları</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Hizmetler, belirlenen randevu saatlerinde online olarak gerçekleştirilir.</li>
                <li>Uzmanlar, profesyonel etik kurallar çerçevesinde hizmet vermeyi taahhüt eder.</li>
                <li>Görüşme süreleri, satın alınan paket kapsamında belirtilen süreler ile sınırlıdır.</li>
                <li>İptal ve değişiklik talepleri en az 24 saat öncesinden bildirilmelidir.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Madde 6: Gizlilik ve Güvenlik</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Görüşmelerin gizliliği esastır ve üçüncü taraflarla paylaşılmaz.</li>
                <li>Kişisel veriler, KVKK kapsamında korunur ve işlenir.</li>
                <li>Platform üzerindeki tüm iletişim şifrelenerek gerçekleştirilir.</li>
                <li>Kullanıcılar, gizlilik ihlali durumunda yasal haklarını kullanabilir.</li>
              </ul>
            </section>
          </div>
        </section>

        <div className="text-sm text-gray-500 mt-8">
          Son Güncelleme Tarihi: {new Date().toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
} 