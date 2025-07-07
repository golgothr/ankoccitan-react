import { Link } from '@tanstack/react-router';
import logo from '@/assets/logo.png';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-occitan-light">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-orange-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2 group">
              <img 
                src={logo} 
                alt="Logo Ankòccitan" 
                className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" 
              />
              <span className="text-xl font-bold text-gray-900">Ankòccitan</span>
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Politique de confidentialité</span>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Politique de confidentialité
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8 text-center">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Ankòccitan s'engage à protéger votre vie privée. Cette politique de confidentialité 
                explique comment nous collectons, utilisons et protégeons vos informations personnelles 
                lorsque vous utilisez notre service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Informations que nous collectons</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-gray-900 mb-2">2.1 Informations que vous nous fournissez</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Nom et prénom</li>
                  <li>Adresse e-mail</li>
                  <li>Pseudonyme</li>
                  <li>Mot de passe (chiffré)</li>
                  <li>Contenu que vous créez (decks, cartes)</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900 mb-2">2.2 Informations collectées automatiquement</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Adresse IP et informations de localisation</li>
                  <li>Type de navigateur et système d'exploitation</li>
                  <li>Pages visitées et temps passé sur le site</li>
                  <li>Données de progression d'apprentissage</li>
                  <li>Cookies et technologies similaires</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Comment nous utilisons vos informations</h2>
              <p className="text-gray-700 mb-4">Nous utilisons vos informations pour :</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Fournir et améliorer nos services</li>
                <li>Personnaliser votre expérience d'apprentissage</li>
                <li>Suivre vos progrès et adapter le contenu</li>
                <li>Communiquer avec vous concernant votre compte</li>
                <li>Assurer la sécurité de notre plateforme</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Partage de vos informations</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Nous ne vendons, ne louons ni ne partageons vos informations personnelles 
                  avec des tiers, sauf dans les cas suivants :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Avec votre consentement explicite</li>
                  <li>Pour fournir des services essentiels (hébergement, analyse)</li>
                  <li>Pour respecter des obligations légales</li>
                  <li>Pour protéger nos droits et notre sécurité</li>
                </ul>
                <p className="text-gray-700">
                  <strong>Note :</strong> Le contenu que vous partagez publiquement (decks, cartes) 
                  peut être visible par d'autres utilisateurs.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Sécurité des données</h2>
              <p className="text-gray-700 mb-4">
                Nous mettons en place des mesures de sécurité appropriées pour protéger vos informations :
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Chiffrement SSL/TLS pour les données en transit</li>
                <li>Chiffrement des mots de passe</li>
                <li>Accès restreint aux données personnelles</li>
                <li>Surveillance continue de la sécurité</li>
                <li>Sauvegardes régulières et sécurisées</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies et technologies similaires</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Nous utilisons des cookies et des technologies similaires pour :
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Maintenir votre session de connexion</li>
                  <li>Mémoriser vos préférences</li>
                  <li>Analyser l'utilisation du site</li>
                  <li>Améliorer nos services</li>
                </ul>
                <p className="text-gray-700">
                  Vous pouvez contrôler l'utilisation des cookies via les paramètres de votre navigateur.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Vos droits</h2>
              <p className="text-gray-700 mb-4">Conformément au RGPD, vous avez le droit de :</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Accéder à vos données personnelles</li>
                <li>Rectifier des informations inexactes</li>
                <li>Demander la suppression de vos données</li>
                <li>Limiter le traitement de vos données</li>
                <li>Portabilité de vos données</li>
                <li>Vous opposer au traitement</li>
                <li>Retirer votre consentement</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Conservation des données</h2>
              <p className="text-gray-700 mb-4">
                Nous conservons vos données personnelles aussi longtemps que nécessaire 
                pour fournir nos services ou respecter nos obligations légales. 
                Les données peuvent être supprimées à votre demande ou après une période 
                d'inactivité prolongée.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Modifications de cette politique</h2>
              <p className="text-gray-700 mb-4">
                Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. 
                Les modifications importantes seront notifiées par e-mail ou via notre site web. 
                Votre utilisation continue du service après les modifications constitue 
                votre acceptation de la nouvelle politique.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact</h2>
              <p className="text-gray-700 mb-4">
                Pour toute question concernant cette politique de confidentialité ou 
                pour exercer vos droits, contactez-nous à :
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email :</strong> 
                  <a href="mailto:privacy@ankoccitan.com" className="text-occitan-red hover:text-occitan-orange transition-colors duration-200 ml-1">
                    privacy@ankoccitan.com
                  </a>
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Délégué à la protection des données :</strong> 
                  <a href="mailto:dpo@ankoccitan.com" className="text-occitan-red hover:text-occitan-orange transition-colors duration-200 ml-1">
                    dpo@ankoccitan.com
                  </a>
                </p>
              </div>
            </section>
          </div>

          {/* Bouton retour */}
          <div className="text-center mt-12">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-occitan-red to-occitan-orange hover:from-occitan-orange hover:to-occitan-red transition-all duration-300 transform hover:scale-105"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 