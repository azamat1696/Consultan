import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <section className="prose max-w-none">
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
                <li>Profil bilgileri ve iletişim verileri, kullanıcı hesabı aktif olduğu sürece sistemde tutulur.</li>
                <li>Mesajlaşma içerikleri ve görüşme kayıtları şifrelenmiş formatta saklanır.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Verilerin Kullanım Amaçları</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Kullanıcı deneyimini geliştirmek, hizmet sunumunu kolaylaştırmak ve güvenlik süreçlerini sağlamak amacıyla bazı anonim veriler işlenebilir.</li>
                <li>Dancomy.com, kullanıcıların kişisel verilerini kesinlikle üçüncü taraflarla paylaşmaz.</li>
                <li>Toplanan veriler, platform hizmetlerinin iyileştirilmesi ve kullanıcı deneyiminin geliştirilmesi için kullanılır.</li>
                <li>İstatistiksel analizler için veriler anonimleştirilerek kullanılabilir.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Kullanıcı Hakları ve Veri Talebi</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Kullanıcılar, kişisel verilerinin nasıl işlendiğine dair bilgi talep edebilir.</li>
                <li>Hesaplarının silinmesini isteyebilir veya yanlış verilerin düzeltilmesini talep edebilir.</li>
                <li>Veri ihlali veya gizlilik ile ilgili bir şüphe durumunda, kullanıcılar destek@dancomy.com adresi üzerinden taleplerini iletebilir.</li>
                <li>KVKK kapsamında sahip oldukları tüm hakları kullanabilirler.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Veri Güvenliği</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tüm veriler endüstri standardı güvenlik protokolleri ile korunmaktadır.</li>
                <li>Düzenli güvenlik testleri ve güncellemeler yapılmaktadır.</li>
                <li>Veri sızıntısı durumunda kullanıcılar derhal bilgilendirilir.</li>
                <li>Çalışanlarımız veri gizliliği konusunda düzenli eğitim almaktadır.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Veri İşleme İlkeleri</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Hukuka ve dürüstlük kurallarına uygun işleme</li>
                <li>Doğru ve gerektiğinde güncel tutma</li>
                <li>Belirli, açık ve meşru amaçlar için işleme</li>
                <li>İşlendikleri amaçla bağlantılı, sınırlı ve ölçülü olma</li>
                <li>İlgili mevzuatta öngörülen veya işlendikleri amaç için gerekli olan süre kadar muhafaza etme</li>
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