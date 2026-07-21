import { NextResponse } from 'next/server';
import db from '@/lib/db';
import slugify from 'slugify';

export async function GET() {
  try {
    const title = 'Analiza Pieței Imobiliare în Băicoi, Județul Prahova: Oportunități și Tendințe în 2026';
    const slug = slugify(title, { lower: true });
    
    const summary = 'Descoperă de ce orașul Băicoi din județul Prahova a devenit un punct de atracție major pentru investiții imobiliare. O analiză detaliată a prețurilor la case și terenuri în acest an.';
    
    const content = `
      <h2>De ce Băicoi atrage tot mai mulți investitori?</h2>
      <p>Aflat într-o poziție strategică în județul Prahova, pe axa Ploiești - Câmpina, orașul <strong>Băicoi</strong> cunoaște o dezvoltare imobiliară accelerată. Datorită accesului facil la Drumul Național 1 (DN1) și proximității față de zonele industriale aflate în plină expansiune, tot mai multe familii și antreprenori aleg această localitate ca variantă principală de rezidență sau investiție.</p>
      
      <h2>Evoluția prețurilor pentru case și vile</h2>
      <p>Spre deosebire de aglomerația urbană din Ploiești sau București, Băicoi oferă liniște și terenuri generoase la prețuri competitive. În prezent, piața este dominată de cererea pentru case individuale și vile noi.</p>
      <ul>
        <li><strong>Casele vechi, tradiționale:</strong> reprezintă o oportunitate excelentă pentru renovare, cu prețuri care pornesc de la 40.000 - 50.000 EUR, în funcție de suprafața terenului.</li>
        <li><strong>Construcțiile noi (duplex-uri și case individuale):</strong> dezvoltatorii s-au orientat către cartiere liniștite, prețurile încadrându-se între 90.000 și 130.000 EUR pentru o locuință finisată la cheie.</li>
      </ul>

      <h2>Piața Terenurilor: O oportunitate de aur</h2>
      <p>Cea mai mare creștere s-a înregistrat în segmentul terenurilor intravilane. Datorită extinderii rețelelor de utilități (apă, canalizare, gaze) în zone anterior nevalorificate, prețul pe metru pătrat a cunoscut o apreciere constantă.</p>
      <p>În zonele centrale și semicentrale, prețurile pot varia între <strong>25 și 45 EUR/mp</strong>, în timp ce parcelele aflate spre periferie sau în zonele cu potențial rezidențial pe termen lung se tranzacționează în jurul valorii de <strong>15-25 EUR/mp</strong>.</p>

      <h2>Avantajele achiziției unui imobil în Băicoi</h2>
      <ul>
        <li><strong>Conectivitate excelentă:</strong> Acces imediat la DN1, fiind la doar 15 minute de Ploiești și o oră de București.</li>
        <li><strong>Dezvoltare a infrastructurii:</strong> Investiții masive în modernizarea străzilor și extinderea utilităților.</li>
        <li><strong>Calitatea vieții:</strong> Mediu nepoluat, mult mai aerisit, ideal pentru tinerii care lucrează în regim remote sau hibrid.</li>
      </ul>

      <h2>Concluzie</h2>
      <p>Anul curent confirmă statutul orașului Băicoi drept o <em>alternativă matură și sustenabilă</em> pentru sectorul imobiliar din Prahova. Indiferent dacă ești în căutarea unei locuințe pentru familia ta sau dorești un randament bun al investiției prin achiziționarea de terenuri, Băicoi merită toată atenția în următoarea perioadă.</p>
    `;

    const image_url = 'https://res.cloudinary.com/dwyztdtso/image/upload/v1784536179/samples/landscapes/nature-mountains.jpg';
    const meta_title = 'Piața Imobiliară Băicoi, Prahova - Analiză și Tendințe | Siena';
    const meta_description = 'Află totul despre evoluția pieței imobiliare din Băicoi, Prahova. Prețuri, oportunități de investiții și tendințe pentru apartamente, case și terenuri.';

    await db.query(
      'INSERT INTO blog_posts (title, slug, summary, content, image_url, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, slug, summary, content, image_url, meta_title, meta_description]
    );
    
    return NextResponse.json({ success: true, message: 'Article created successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
