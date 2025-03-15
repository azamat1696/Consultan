import React from 'react';

export default function ReturnAndCookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <section className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">İADE SÜRECİ VE ÇEREZ POLİTİKASI</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">İADE SÜRECİ</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">1. İade Talep Süresi</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Hizmet alımını takiben 24 saat içinde kullanıcılar iade talebinde bulunabilir.</li>
                    <li>Hizmet başlamadan önce yapılan iade talepleri tam iade ile sonuçlanır.</li>
                    <li>Başlamış hizmetler için kısmi iade değerlendirilebilir.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2. İade Süreci ve Değerlendirme</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>İade işlemleri, kullanıcının sunduğu kanıtlar değerlendirilerek en geç 72 saat içinde sonuçlandırılacaktır.</li>
                    <li>Değerlendirme kriterleri:
                      <ul className="list-disc pl-6 mt-2">
                        <li>Hizmetin başlayıp başlamadığı</li>
                        <li>İade talebinin gerekçesi</li>
                        <li>Sunulan kanıtlar</li>
                        <li>Uzman görüşü</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">3. İade Şekli</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Dancomy.com, doğrudan para iadesi yapmaz, ancak havuzda bekleyen ödeme üzerinden işlem gerçekleştirir.</li>
                    <li>İade onaylandığında, tutar kullanıcının platform cüzdanına aktarılır.</li>
                    <li>Cüzdandaki bakiye:
                      <ul className="list-disc pl-6 mt-2">
                        <li>Başka bir hizmet alımında kullanılabilir</li>
                        <li>Banka hesabına aktarım talep edilebilir</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">ÇEREZ POLİTİKASI</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">1. Çerez Kullanımı</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Dancomy.com, kullanıcı deneyimini geliştirmek için zorunlu çerezler dışında herhangi bir üçüncü taraf çerez kullanmamaktadır.</li>
                    <li>Zorunlu çerezler:
                      <ul className="list-disc pl-6 mt-2">
                        <li>Oturum yönetimi</li>
                        <li>Güvenlik doğrulamaları</li>
                        <li>Temel site fonksiyonları</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">2. Çerez Tercihleri</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Kullanıcılar, çerez kullanım tercihlerini tarayıcı ayarlarından değiştirebilir.</li>
                    <li>Çerez kullanımını reddetme hakkı:
                      <ul className="list-disc pl-6 mt-2">
                        <li>Zorunlu çerezler hariç tüm çerezler reddedilebilir</li>
                        <li>Çerezlerin reddedilmesi bazı site özelliklerinin çalışmamasına neden olabilir</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">3. Çerez Güvenliği</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-600">
                    <li>Tüm çerezler şifrelenerek saklanır.</li>
                    <li>Üçüncü taraflarla paylaşılmaz.</li>
                    <li>Düzenli güvenlik kontrolleri yapılır.</li>
                    <li>Kullanıcılar istedikleri zaman Dancomy.com'a çerez kullanımına dair itirazlarını iletebilir.</li>
                  </ul>
                </div>
              </div>
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