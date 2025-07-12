# Configuration de Sécurité Auth Supabase

## 🔧 Corrections des Warnings de Sécurité

### 1. OTP Expiry (auth_otp_long_expiry)

**Problème :** L'expiration OTP est définie à plus d'une heure.

**Solution :**

1. Allez dans votre dashboard Supabase
2. Navigation : **Authentication** → **Settings** → **Auth**
3. Trouvez la section **Email Auth**
4. Modifiez **OTP Expiry** à une valeur inférieure à 1 heure (recommandé : 15-30 minutes)

### 2. Leaked Password Protection (auth_leaked_password_protection)

**Problème :** La protection contre les mots de passe compromis est désactivée.

**Solution :**

1. Allez dans votre dashboard Supabase
2. Navigation : **Authentication** → **Settings** → **Auth**
3. Trouvez la section **Password Security**
4. Activez **Leaked Password Protection**
5. Cette fonctionnalité vérifie les mots de passe contre HaveIBeenPwned.org

## 🚀 Script SQL pour les Fonctions

Exécutez le script `sql/10-fix-function-search-path.sql` pour corriger les 19 warnings de fonctions avec search_path mutable.

## 📋 Résumé des Corrections

Après ces corrections, vous devriez avoir :

- ✅ 0 warning de performance RLS
- ✅ 0 warning de fonctions search_path mutable
- ✅ 0 warning de configuration Auth

## 🔒 Bénéfices de Sécurité

- **OTP plus court** : Réduit le risque d'utilisation d'OTP expirés
- **Protection des mots de passe** : Empêche l'utilisation de mots de passe compromis
- **Fonctions sécurisées** : Évite les injections SQL via search_path

## 📞 Support

Si vous rencontrez des problèmes avec ces configurations, consultez la documentation Supabase :

- [Auth Settings](https://supabase.com/docs/guides/auth/auth-settings)
- [Password Security](https://supabase.com/docs/guides/auth/password-security)
