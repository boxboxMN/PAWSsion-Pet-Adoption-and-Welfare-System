# PAWSsion-Pet-Adoption-and-Welfare-System
TEAM HONEYGOLD S/Y 2026-2027


matchmaking.html → Interface ng user.
matchmaking.js → Nagpapadala ng request.
routes/matchmaking.js → Tumatanggap ng request.
matchmakingController.js → Nagpo-process at kumokonekta sa FastAPI.
main.py → Entry point ng FastAPI.
matchmaking.py → Matchmaking algorithm.
recommendation.py → Recommendation logic.
requirements.txt → Listahan ng Python packages na kailangan para gumana ang FastAPI.

tailwind install 
1. npm install -D tailwindcss@3
npx tailwindcss init
2. npx tailwindcss -i ./public/assets/css/input.css -o ./public/assets/css/tailwind.css --watch
3. npm install multer for uploading files
4. working admin side email: admin@pawpon.com || password: admin@pawpon.com || org and user accounts: use email for password
5. add sessions for each user (not yet started)
6. Pa add nalang sa database nito 
ALTER TABLE accounts
ADD COLUMN last_login DATETIME NULL
AFTER updated_at;
7. pa add nalang sa database nito for modify nung action sa status ng mga usermanagement
ALTER TABLE accounts 
MODIFY COLUMN status ENUM('pending', 'active', 'disabled', 'suspended', 'banned', 'rejected') DEFAULT 'active';
8. Import nyo na lang yung bagong database, may nabago doon
9. kapag may bagong page sa org na need iclick yung logout, iadd na lang to sa dulo ng html bago mag </body> tag:

<!--Logout Modal-->
        <div id="logoutModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-200">
            <div class="bg-white rounded-2xl max-w-sm w-full mx-4 p-6 shadow-2xl scale-95 transition-transform duration-200">
                <div class="text-center">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 mb-4">
                        <i class="fa-solid fa-right-from-bracket text-red-600 text-lg"></i>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900">Logging Out?</h3>
                    <p class="text-sm text-gray-500 mt-2">Are you sure you want to leave the Pawpon Org Portal?</p>
                </div>
                <div class="mt-6 flex gap-3">
                    <button id="cancelLogoutBtn" class="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition text-sm">
                        Cancel
                    </button>
                    <button id="confirmLogoutBtn" class="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition shadow-sm shadow-red-200 text-sm">
                        Yes, Logout
                    </button>
                </div>
            </div>
        </div>


# **9. TO DO (07.19.26)**
## **LOGIN**
✓ forgot password


## **ALL MODULES**
- **Session handling**
  - Prevent unauthorized access to protected pages
  - Redirect unauthenticated users to login
  - Destroy session on logout
- **Make pages responsive**

---

## **USERSIDE MODULES**
✓ Use **Title** and **Subtitle** for headers/topbar
- Notification
✓ Connect **Dashboard**,
- **My Application** and **Kamustahan** to DB
✓ Connect **Matchmaking**, **Donation**
- Improve CSS

---

## **ORG MODULES**
✓ Use **Title** and **Subtitle** for headers/topbar
- Notification
✓ Search, CRUD
✓ Connect **Dashboard**, **Application**,**Donation** 
- Connect **Kamustahan**, **Analytics**, and **Organization Profile** to DB
- Settings & 
✓ Support
✓ **Analytics**
- Improve CSS

---

## **ADMIN MODULES**
- Notification
- Search, CRUD
- Connect **Dashboard**,  **Feedback**, **Account Actions** to DB
- Connect Org Details to db
- Settings
- Improve CSS

---

## **CODE**
- Clean unnecessary whitespaces, redundant/unused codes
- Separate HTML, CSS, and JavaScript properly
- Check for hard-coded lines
- Add comments where necessary *(for easy debugging)*

---
# 10. TARGET DEPLOYMENT??

> *pa add kung ano pa gagawin dito*
bry naniya

# 11.
paimport na lang ng user_adoption_applications table sa db nyo

# 12. 
Pa update na lang ng db, palagay netong command:

ALTER TABLE user_adoption_applications ADD COLUMN decline_reason TEXT NULL AFTER status;

ALTER TABLE user_adoption_applications
ADD COLUMN interview_date DATE NULL,
ADD COLUMN interview_time VARCHAR(50) NULL,
ADD COLUMN interview_method ENUM('onsite', 'virtual') DEFAULT 'virtual',
ADD COLUMN interview_location_link TEXT NULL;


HOW TO RUN WITH WORKING MATCHMAKING FEATURE
- import new db (7.23)
- create .venv first inside flask-api
    *terminal: cd flask-api then python -m venv .venv
             : .venv\Scripts\activate
             :.venv\Scripts\Activate.ps1
- install requrements
    *terminal: pip install -r requirements.txt
             : pip install -r requirements.txt
             : python -m pip install flask sentence-transformers torch scikit-learn python-dotenv
             : python download_model.py
- run Flask API
    *terminal: python app.py (keep this running on venv)
- run Node.js
    *terminal: node server.js (this should be in new terminal)

# August 4, 2026

# Paimport na lang ng user_adoption_applications sa db nyo may nabago lang doon


# Mga need pa ayusin:

Not working:

CREATE AN ACCOUNT:

    Lagyan ng scroll bar

USER SIDE:

Dashboard:
	
	✓ Make it Real-time!
	✓ Quick Actions: Upcoming Interview
	✓ Recent Activities
	✓ Upcoming Schedule

    ✓ kapag lagpas na sa interview datesa dashboard, mawawala na sa upcoming schedule while sa application page naman, yung nilalgyan ng request schedule is mawawala mapapalitan ng interview done | awaiting org decision

Notification:

	Dapat nakikita ang lahat ng changes sa notif and dapat sa sidebar is kapag may changes may pula na bilog na nagaappear

    Under My Application:
        Dapat kapag may bagong update is may notif like parang read or unread sa may under review, interview sched, pending, declined

Profile: -- ok na ( Jhy ) - pa check nalang
	
	Dapat nakikita yung picture sa lahat ng page, Hindi lang profile nakalagay hindi pa gumagana sa dashboard, kamustahan, donations, profile, matchmaking pages

My Application: 

	✓ Ayusin sa Adoption Applications under view
	✓ Dapat nakikita yung mga info sa application pati na din ang interview schedule
	✓ Ayusin yung sa may number

    ✓ Dapat kapagg nag resched ang org nanotif doon sa application ng user

	✓ What if, once na yung applicaiton is under interview schedule is pwedeng magrequest ang adopter to change date once na hindi sila available
    
	✓ kapag nadecline sa view details dapat may reapply button if gusto pang mag apply yung user sa same pet na yun

    ✓ sa reschedule approved na lumalabas lang kapag nagrequest

    dapat once na adopted na yung pet pero yung isang user is may under review, dapat maging declined na yun since naadopt na ng isang user ang pet

    Once na approved na dapat may inotify pa ang user kung kelan makukuha ang pet 

    ✓ fixed date and time
Adoption-hub: 	
	
	✓ Once na adopted na yung pet is hindi na sya makikita ng ibang user sa adoption page

    ✓ Kapag nadecline, kapag pinag view yung details is nakalagay doon is decline view details kung   bakit nadecline then mapupunta doon sa applications

    ✓ may bug kapag binubuksan ang reason kapag declined

Notes: 
Mga ned iconfirm kay jhy: donation side, profile yung sa pagchange ng pass, kamustahan

ORGANIZATION:

Pets: 
	
	✓ Sa available, makikita pa din yung all status, all species and add pet

	✓ Sa adopted, dapat makikita pa din yung all species

	✓ Sa Add new pet, alisin yung archive sa adoption status

    ✓ alisin din ang archive sa all; status

    ✓ ilipat ang archive sa sarili; nyang button

    ✓ Sa add new pet, kapag pinili ang adopted satus dapat may lilitaw na additional form for adopters information

	✓ Sa view Profile, alisin ang birth date, date sa medical history

    ✓ Edit Record may bug pet_desciption = behavior_description

	✓ Iseparate ang available sa adopted para hindi malito ang orgs
	Iseparate ang archive pero tignan sa controller dapat gumagana pa din yung ibang functions

	✓ Dapat once na adopted is wala ng edit, archive and delete buttons instead dapat may view adoption applications button na mapupunta doon sa adoption application details

	✓ Once available may archive, edit & delete buttons

    ✓ Under add pet, sa may adoption status dapat once na adopted auto na malalgay sa adopted pets, and yung available and pending is sa active status

    ✓ Archive is may unarchive buttons and nakahide ang edit, delete buttons

    Once na approved na dapat may inotify pa ang user kung kelan makukuha ang pet 

    
# Questions and Testing

    Under add pet, itanong if magkaiba ang pet description at personality & traits since pwede naman mailagay ang personality & traits sa pet description??

    Itry ni mayie mag edit, delete, at add pet if nagpafunction pa

Adoption:

	✓ Export Summary

	✓ lagyan ng edit schedule ang application details

    ✓ kapag nagrequest ang adopter ng resched of interview dapat makikita ng org

    ✓ kapag decline, instead of idisable ang declined button dapat auto na napapalitan ng view declined details

    ✓ Under Interview nschedule, yung date is hindi tugma doon sa napiliing date, ang inistore is yung kung kailan ka nag sched ng interview

    ✓ ayusing yung sa applicant name diba yung org naglagay ng add pet na adopted dapat lumabas doon yuyng name ng nagadopt

    ✓ fixed date and time

Settings & Support:
	
	Hindi pa final

Notification:

	Dapat nakikita ang lahat ng changes sa notif and dapat sa sidebar is kapag may changes may pula na bilog na nagaappear
	
NOTES:

✓ Itanong kay jhy if ok na yung kamustahan

ADMIN:

Di ko pa navivisit

	
# I run nyo to sa db:

ALTER TABLE user_adoption_applications 
MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'Under Review';

# install this in project folder
npm install nodemailer
# Aug 08, 2026
Import nyo na lang yung user adoption applicationsn table may additional columns don

# Pa run sa db: (Aug 09, 2026)
CREATE TABLE IF NOT EXISTS `application_interviews` (
  `interview_id` INT(11) NOT NULL AUTO_INCREMENT,
  `application_id` INT(11) NOT NULL,
  `interview_date` DATE DEFAULT NULL,
  `interview_time` TIME DEFAULT NULL,
  `interview_method` VARCHAR(50) DEFAULT NULL,
  `interview_location_link` TEXT DEFAULT NULL,
  `requested_interview_date` DATE DEFAULT NULL,
  `requested_interview_time` TIME DEFAULT NULL,
  `reschedule_reason` TEXT DEFAULT NULL,
  `resched_status` VARCHAR(50) DEFAULT 'None',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`interview_id`),
  UNIQUE KEY `unique_app_interview` (`application_id`),
  CONSTRAINT `fk_interview_application` FOREIGN KEY (`application_id`) REFERENCES `user_adoption_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `application_interviews` (
  `application_id`,
  `interview_date`,
  `interview_time`,
  `interview_method`,
  `interview_location_link`,
  `requested_interview_date`,
  `requested_interview_time`,
  `reschedule_reason`,
  `resched_status`
)
SELECT 
  `application_id`,
  `interview_date`,
  `interview_time`,
  `interview_method`,
  `interview_location_link`,
  `requested_interview_date`,
  `requested_interview_time`,
  `reschedule_reason`,
  `resched_status`
FROM `user_adoption_applications`
WHERE `interview_date` IS NOT NULL 
   OR `requested_interview_date` IS NOT NULL 
   OR `resched_status` != 'None';

ALTER TABLE `user_adoption_applications`
  DROP COLUMN `interview_date`,
  DROP COLUMN `interview_time`,
  DROP COLUMN `interview_method`,
  DROP COLUMN `interview_location_link`,
  DROP COLUMN `requested_interview_date`,
  DROP COLUMN `requested_interview_time`,
  DROP COLUMN `reschedule_reason`,
  DROP COLUMN `resched_status`;


  # Palagay sa db nyo
  ALTER TABLE animals DROP COLUMN birth_date;
  
  # Palagay sa db ny:o Aug 14 (today)
  ALTER TABLE user_adoption_applications 
    MODIFY COLUMN adopter_id INT NULL;


# AUG 19, 2026

# new folder under public: ✓
    folder data - for storing the addresses

# MGA NABAGO SA DB ✓
    adopters table
    organizations table

# mga files na may changes: ✓
    Authcontroller
    assets/css/create_account
    auth/create-account.html
    read.me
    assets/css/organization_signup
    auth/organization_signup.html

# MGA nafix
    Create account (adopter):
        may sanitation na ang birthday, below 18 cannot be an adopter
        may sanitations na doon sa mga address, zip code
    Create account (organization):
        css ng org



# new acc:

irespeleta@my.cspc.edu.ph pass: irespeleta@my.cspc.edu.ph2A
eneriatelpse@gmail.com pass: 1Eneriatelepse@gmail.com

# new functions na need iupdate:

user profile
org profile


sa edit user profile:  ✓

dapat kung paano yung sa create an account ganun din ang nasa edit ✓


account type palitan ng role ✓

remove the account type ✓

sa profile: ✓
makikita ng user are:
birthday
civil status (if meron, else if = none, hide the civil status)
occupation
full address

kapag nasa edit profile na:  ✓

First Name
Last Name
Email
Mobile Number
Birthday
Civil Status
Occupation
Street Address
Barangay
City / Municipality
Province
Region
ZIP Code

user side:

    adoption hub : ✓
        prefilled pero pwede naman iedit dapat yung sa name, wag daw ang age, birthday na lang or through bday macocompute na ang age
 
# AUG 21, 2026 ✓
ALTER TABLE animals
DROP COLUMN color,
DROP COLUMN personality_tags;


# Aug 21, 2026 (5 am)

ALTER TABLE user_adoption_applications
-- 1. Idagdag ang JSON column para sa snapshot
ADD COLUMN applicant_snapshot JSON AFTER adopter_id,

-- 2. Tatanggalin ang mga redundant user profile columns
DROP COLUMN full_name,
DROP COLUMN contact_number,
DROP COLUMN email,
DROP COLUMN full_address,
DROP COLUMN civil_status,
DROP COLUMN age,
DROP COLUMN occupation;

# may bugs pa sa dashboard:

kapag nainterview sched at nadecline then nag re apply ulit, nakikita sa dashboard recent activities na interview scheduled kahit under review pa naman  ✓

sa org naman kahit under review after ng decline, hindi naerase ang dating interview sched ✓


# important notes:

pagsamahin ang sa adoptionHub.html & yung sa vcalude ai na nasa cspc acc ✓

Added view profile organization ✓

# itest tom (Aug 23, 2026 8 am):

pag enable na ang decline, ideclined ang adoption then try to re-apply and check if the address 
is match with the address in the user profile ✓

Tignan if yung view profile organization will appear in under review, approved, declined or cancelled  ✓