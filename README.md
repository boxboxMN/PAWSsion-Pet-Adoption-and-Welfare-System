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
- forgot password


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
- Connect **Dashboard**,**My Application** and **Kamustahan** to DB
✓ Connect **Matchmaking**, **Donation**
- Improve CSS

---

## **ORG MODULES**
✓ Use **Title** and **Subtitle** for headers/topbar
- Notification
✓ Search, CRUD
✓ Connect **Dashboard**, **Application**,**Donation** 
- Connect **Kamustahan**, **Analytics**, and **Organization Profile** to DB
- Settings & Support
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

USER SIDE:

Dashboard:
	
	Make it Real-time!
	Quick Actions: Upcoming Interview
	Recent Activities
	Upcoming Schedule

Notification:

	Dapat nakikita ang lahat ng changes sa notif and dapat sa sidebar is kapag may changes may pula na bilog na nagaappear

Profile: 
	
	Dapat nakikita yung picture sa lahat ng page, Hindi lang profile nakalagay

My Application: 

	✓ Ayusin sa Adoption Applications under view
	✓ Dapat nakikita yung mga info sa application pati na din ang interview schedule
	✓ Ayusin yung sa may number

    Dapat kapagg nag resched ang org nanotif doon sa application ng user

	Dapat kapag may bagong update is may notif like parang read or unread sa may under review, interview sched, pending, declined

	What if, once na yung applicaiton is under interview schedule is pwedeng magrequest ang adopter to change date once na hindi sila available
    
	kapag nadecline sa view details dapat may reapply button if gusto pang mag apply yung user sa same pet na yun

Adoption-hub: 	
	
	- Once na adopted na yung pet is hindi na sya makikita ng ibang user sa adoption page

    ✓ Kapag nadecline, kapag pinag view yung details is nakalagay doon is decline view details kung   bakit nadecline then mapupunta doon sa applications

    ✓ may bug kapag binubuksan ang reason kapag declined

Notes: 
Mga ned iconfirm kay jhy: donation side, profile yung sa pagchange ng pass, kamustahan

ORGANIZATION:

Pets: 
	
	Sa available, makikia pa din yung all status, all species and add pet
	Sa adopted, dapat makikita pa din yung all species
	Sa Add new pet, alisin yung archive sa adoption status & ilagay na lang sa gilid (checkbox)
	Ayusin yung mga error
	Sa view Profile, alisin ang birth date, date sa medical history
    Edit Record may bug pet_desciption = behavior_description
	
	OPTION 1:
	Iseparate ang available sa adopted para hindi malito ang orgs
	Iseparate ang archive pero tignan sa controller dapat gumagana pa din yung ibang functions
	Dapat once na adopted, pending na yung pet is may edit record, and archive button sya wala ng delete
	Once available, walang archive pero nandoon yung edit & delete buttons
	
	OPTION 2:
	once adopted and pending na is automatic na nasa archive na sila pero dapat may notice pa din sa org


Adoption:

	Export Summary

	lagyan ng edit schedule ang application details

    kapag nagrequest ang adopter ng resched of interview dapat nasa notif and makikita ng org

    ✓ kapag decline, instead of idisable ang declined button dapat auto na napapalitan ng view declined details

    Under Interview nschedule, yung date is hindi tugma doon sa napiliing date, ang inistore is yung kung kailan ka nag sched ng interview

Settings & Support:
	
	Hindi pa final

Notification:

	Dapat nakikita ang lahat ng changes sa notif and dapat sa sidebar is kapag may changes may pula na bilog na nagaappear
	


NOTES:

Itanong kay jhy if ok na yung donation, kamustahan

ADMIN:

Di ko pa navivisit

	
# I run nyo to sa db:

ALTER TABLE user_adoption_applications 
MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'Under Review';