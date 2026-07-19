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
7. pa add nalang sa database nito for modify nung action sa status ng mga user 
ALTER TABLE accounts
MODIFY COLUMN status ENUM(
    'pending',
    'active',
    'disabled',
    'suspended',
    'banned',
    'rejected'
) DEFAULT 'active';
8. kapag may bagong page sa org na need iclick yung logout, iadd na lang to sa dulo ng html bago mag </body> tag:

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

9. TO DO (07.19.26)
    - ALL MODULES
    (
    - session handling 
    - Prevent unauthorized access to protected pages
    - Redirect unauthenticated users to login
    - Destroy session on logout
    - make pages resonsive
    )

    - USERSIDE MODULES
    ( 
        - use title and subtitle for headers/topbar
        - notification
        - connect dashboard, matchmaking, my application, donation, kamustahan to db
        - improve css
    )

    - ORG MODULES
    ( 
        - use title and subtitle for headers/topbar
        - notification
        - search, CRUD
        - connect dashboard, application, kamustahan, analytics, organization profile to db
        - settings & support 
        - improve css
    )

    - ADMIN MODULES
    ( 
        - notification
        - search, CRUD
        - connect dashboard, feedback to db
        - settings
        - improve css
    )
