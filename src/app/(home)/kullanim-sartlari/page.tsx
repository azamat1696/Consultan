import React from 'react';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* KULLANIM ŞARTLARI */}
        <section className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">KULLANIM ŞARTLARI</h1>
          <p className="text-gray-600 mb-6">
            Bu kullanım şartları, Dancomy.com platformunun tüm kullanıcıları için bağlayıcı olup, platformun sunduğu hizmetlerden yararlanan tüm bireylerin bu şartları okuduğunu, anladığını ve kabul ettiğini beyan eder. Dancomy.com, uzmanlar ile danışanları bir araya getiren bir aracı hizmet platformu olarak faaliyet göstermektedir. Platform, doğrudan herhangi bir danışmanlık, terapi, koçluk veya benzeri hizmet sunmamakta olup, yalnızca uzmanların kendilerini tanıtabileceği ve hizmetlerini sunabileceği bir alan sağlamaktadır.
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Taraflar ve Genel Hükümler</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dancomy.com'a kayıt olan her kullanıcı, kullanım şartlarını kayıt esnasında onaylamak zorundadır.</li>
                <li>Dancomy.com, gerektiğinde kullanım şartlarını tek taraflı olarak değiştirme hakkına sahiptir. Kullanıcılar, güncellenen şartları düzenli olarak takip etmekle yükümlüdür.</li>
                <li>Kullanıcılar, platformda sundukları bilgilerin doğruluğundan tamamen kendileri sorumludur. Yanlış veya yanıltıcı bilgi veren kullanıcıların hesapları askıya alınabilir veya tamamen kapatılabilir.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Kullanıcı Kategorileri ve Sorumlulukları</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Uzmanlar:</strong> Dancomy.com üzerinden hizmet sunmak isteyen kişiler, mesleki kimlik, eğitim geçmişi ve deneyimlerini doğrulayan belgeler sunmak zorundadır. Yanıltıcı bilgi paylaşan uzmanların hesapları kalıcı olarak kapatılacaktır.</li>
                <li><strong>Danışanlar:</strong> Hizmet almak isteyen kullanıcılar, kayıt esnasında doğru kimlik bilgilerini beyan etmek zorundadır.</li>
                <li>Dancomy.com, uzmanlar tarafından sunulan hizmetlerin kalitesinden sorumlu değildir ve taraflar arasındaki hizmet akdine müdahil olmaz.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Yasa Dışı ve Etik Dışı İçeriklerin Yasaklanması</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Platform üzerinden dolandırıcılık, sahtecilik, etik dışı uygulamalar, yasalarla çelişen hizmetler kesinlikle sunulamaz.</li>
                <li>Kullanıcılar, başka bir kullanıcıyı rahatsız edemez, tehdit edemez veya kötü niyetli davranışlarda bulunamaz.</li>
                <li>Psikolojik rahatsızlıkları ileri seviyede olan kullanıcıların platform üzerinden hizmet alması önerilmemektedir; bu tür durumlar için resmi sağlık kuruluşlarına başvurulmalıdır.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Uyuşmazlık Çözümleri ve Sorumluluk Reddi</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Kullanıcılar arasındaki anlaşmazlıklar öncelikle Dancomy.com destek ekibi aracılığıyla çözülmeye çalışılır.</li>
                <li>Dancomy.com, kullanıcıların sunduğu hizmetlerden veya yaptığı işlemlerden doğacak hiçbir yasal sorumluluğu üstlenmez.</li>
                <li>Kullanıcılar, hukuki bir ihtilaf doğduğunda bağımsız olarak yasal süreçlerini yürütmekle yükümlüdür.</li>
              </ul>
            </section>
          </div>
        </section>

        {/* GİZLİLİK HAKLARI VE KVKK */}
        <section className="prose max-w-none mt-12">
          <h1 className="text-3xl font-bold mb-6">GİZLİLİK HAKLARI VE KVKK</h1>
          <p className="text-gray-600 mb-6">
            Dancomy.com olarak, kullanıcılarımızın kişisel verilerini 6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında koruma altına almaktayız. Kullanıcıların Dancomy.com platformunu kullanırken paylaştıkları veriler, aşağıda belirtilen esaslara uygun olarak saklanmakta ve işlenmektedir.
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Toplanan Kişisel Veriler ve Saklama Süresi</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Kullanıcıların e-posta adresleri platformda güvenli şekilde şifrelenerek saklanır.</li>
                <li>Kullanıcılar tarafından girilen ödeme bilgileri, görüşme içerikleri veya özel bilgiler kesinlikle saklanmaz.</li>
                <li>Kullanıcı hesaplarıyla ilişkili veriler, kullanıcı hesapları aktif olduğu sürece saklanır ve hesap kapatıldığında kalıcı olarak silinir.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Verilerin Kullanım Amaçları</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Kullanıcı deneyimini geliştirmek, hizmet sunumunu kolaylaştırmak ve güvenlik süreçlerini sağlamak amacıyla bazı anonim veriler işlenebilir.</li>
                <li>Dancomy.com, kullanıcıların kişisel verilerini kesinlikle üçüncü taraflarla paylaşmaz.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Kullanıcı Hakları ve Veri Talebi</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Kullanıcılar, kişisel verilerinin nasıl işlendiğine dair bilgi talep edebilir, hesaplarının silinmesini isteyebilir veya yanlış verilerin düzeltilmesini talep edebilir.</li>
                <li>Veri ihlali veya gizlilik ile ilgili bir şüphe durumunda, kullanıcılar destek@dancomy.com adresi üzerinden taleplerini iletebilir.</li>
              </ul>
            </section>
          </div>
        </section>

        {/* MESAFELİ SATIŞ SÖZLEŞMESİ */}
        <section className="prose max-w-none mt-12">
          <h1 className="text-3xl font-bold mb-6">MESAFELİ SATIŞ SÖZLEŞMESİ</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Madde 1: Taraflar</h2>
              <p>İşbu sözleşme, Dancomy.com ile platformda sunulan hizmetlerden yararlanmak isteyen kullanıcılar (bundan sonra "Alıcı" olarak anılacaktır) arasında elektronik ortamda akdedilmiştir.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Madde 2: Konu</h2>
              <p>Bu sözleşme, Dancomy.com üzerinden satın alınan hizmetlerin satışı, ifası, ödeme koşulları ve tarafların hak ve yükümlülüklerini düzenlemektedir.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Madde 3: Satış ve Ödeme Koşulları</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Kullanıcılar, uzmanlar tarafından belirlenen hizmet bedellerini platform aracılığıyla öder.</li>
                <li>Dancomy.com, satış işlemlerinde aracıdır ve tahsil edilen ücretin %40'ını hizmet komisyonu olarak alır.</li>
                <li>Ödeme işlemi tamamlandıktan sonra uzman, hizmeti sağlamakla yükümlüdür.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Madde 4: Cayma Hakkı ve İptaller</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Kullanıcılar, hizmeti satın aldıktan 24 saat içinde iade talebinde bulunabilir.</li>
                <li>Uzmanın sunduğu hizmetten memnun kalmayan kullanıcılar, şikayetlerini destek@dancomy.com adresine iletmelidir.</li>
              </ul>
            </section>
          </div>
        </section>

        {/* İADE SÜRECİ - ÇEREZ POLİTİKASI */}
        <section className="prose max-w-none mt-12">
          <h1 className="text-3xl font-bold mb-6">İADE SÜRECİ - ÇEREZ POLİTİKASI</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">İADE SÜRECİ</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Hizmet alımını takiben 24 saat içinde kullanıcılar iade talebinde bulunabilir.</li>
                <li>İade işlemleri, kullanıcının sunduğu kanıtlar değerlendirilerek en geç 72 saat içinde sonuçlandırılacaktır.</li>
                <li>Dancomy.com, doğrudan para iadesi yapmaz, ancak havuzda bekleyen ödeme üzerinden işlem gerçekleştirir.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">ÇEREZ POLİTİKASI</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dancomy.com, kullanıcı deneyimini geliştirmek için zorunlu çerezler dışında herhangi bir üçüncü taraf çerez kullanmamaktadır.</li>
                <li>Kullanıcılar, çerez kullanım tercihlerini tarayıcı ayarlarından değiştirebilir ve istedikleri zaman Dancomy.com'a çerez kullanımına dair itirazlarını iletebilir.</li>
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