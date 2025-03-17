import { Card, CardBody } from "@heroui/react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hakkımızda</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardBody>
            <h2 className="text-2xl font-semibold mb-4">Dancomy Nedir?</h2>
            <p className="text-gray-600 mb-4">
              Dancomy, danışmanlık hizmetlerini dijital ortamda buluşturan yenilikçi bir platformdur. 
              Amacımız, uzman danışmanlar ile ihtiyaç sahiplerini etkili bir şekilde bir araya getirmek 
              ve kaliteli danışmanlık hizmetlerini herkes için erişilebilir kılmaktır.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-2xl font-semibold mb-4">Misyonumuz</h2>
            <p className="text-gray-600 mb-4">
              Dancomy olarak misyonumuz, danışmanlık sektörünü dijitalleştirerek daha erişilebilir 
              ve şeffaf hale getirmektir. Platformumuz üzerinden:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Uzman danışmanların bilgi ve deneyimlerini paylaşmalarını sağlıyoruz</li>
              <li>Danışmanlık hizmetlerini standartlaştırıyoruz</li>
              <li>Şeffaf fiyatlandırma ve değerlendirme sistemi sunuyoruz</li>
              <li>7/24 erişilebilir danışmanlık hizmeti sağlıyoruz</li>
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-2xl font-semibold mb-4">Vizyonumuz</h2>
            <p className="text-gray-600 mb-4">
              Dancomy'nin vizyonu, Türkiye'nin ve dünyanın en güvenilir ve kapsamlı online 
              danışmanlık platformu olmaktır. Hedeflerimiz:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Dijital danışmanlık sektöründe öncü olmak</li>
              <li>Kaliteli danışmanlık hizmetlerini global ölçekte sunmak</li>
              <li>Sürekli gelişen ve yenilenen bir platform olmak</li>
              <li>Kullanıcı deneyimini sürekli iyileştirmek</li>
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-2xl font-semibold mb-4">Değerlerimiz</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Güvenilirlik:</strong> Platformumuzda yer alan tüm danışmanlar detaylı bir değerlendirme sürecinden geçer</li>
              <li><strong>Şeffaflık:</strong> Fiyatlandırma ve hizmet detayları açık ve net bir şekilde sunulur</li>
              <li><strong>Kalite:</strong> Sürekli gelişim ve kalite kontrolü ile en iyi hizmeti sunmayı hedefleriz</li>
              <li><strong>Kullanıcı Odaklılık:</strong> Kullanıcılarımızın ihtiyaçları ve geri bildirimleri bizim için önceliklidir</li>
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-2xl font-semibold mb-4">İletişim</h2>
            <p className="text-gray-600 mb-4">
              Bizimle iletişime geçmek için aşağıdaki kanalları kullanabilirsiniz:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>E-posta: info@dancomy.com</li>
              <li>Telefon: +90 (XXX) XXX XX XX</li>
              <li>Adres: İstanbul, Türkiye</li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
} 