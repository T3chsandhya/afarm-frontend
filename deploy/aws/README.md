# AFARM frontend deploy

Production URL: **https://afarm.khulega.online**  
API: **https://api.afarm.khulega.online**

One-time server steps and Route 53 are in the **backend** repo:

**[afarm-backend/deploy/aws/README.md](https://github.com/YOUR_USER/afarm-backend/blob/main/deploy/aws/README.md)**

After setup, push to `main` → GitHub Actions runs `deploy/aws/deploy-frontend.sh` on the EC2.

Keep `.env.production` only on the server (copy from `.env.production.example` once).