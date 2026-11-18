import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store';
import AccountSidebar from '@/components/sidebar/profile/SideBar';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, login } = useAuthStore();
  const location = useLocation();
  const isSettings = location.hash === '#settings';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.name) {
      const parts = user.name.trim().split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
    } else {
      setFirstName('Google');
      setLastName('User');
    }

    if (user?.email) {
      setEmail(user.email);
    } else {
      setEmail('user.google@himalayanfresh.in');
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (user) {
      login({
        ...user,
        name: fullName || user.name,
        email: email.trim() || user.email,
      });
    }
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Profile updated successfully!');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] py-10 sm:py-14">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#173D29] mb-8">
          {isSettings ? 'Account Settings' : 'My Profile'}
        </h1>

        <div className="grid lg:grid-cols-4 gap-8 items-start">
          <AccountSidebar />

          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#EEF2EC] shadow-xs">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#173D29] mb-2">
                {isSettings ? 'Security & Preferences' : 'Personal Information'}
              </h2>
              <p className="text-sm text-[#5D7362] mb-8">
                {isSettings
                  ? 'Manage your communication preferences and orchard security settings.'
                  : 'Manage your contact details and default delivery address for farm-fresh orders.'}
              </p>

              <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#274B33] mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input-field"
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#274B33] mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input-field"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#274B33] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="Email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#274B33] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field"
                    placeholder="+91 Phone number"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-full bg-[#173D29] hover:bg-[#112E1F] text-white px-8 py-3.5 font-semibold text-sm sm:text-base shadow-md shadow-[#173D29]/20 transition-all duration-200 cursor-pointer disabled:opacity-60"
                  >
                    {isSaving ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}